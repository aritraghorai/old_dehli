import bcryptService from "@/services/bcrypt.service";
import jwtService from "@/services/jwt.service";
import otpService from "@/services/otp.service";
import catchAsync from "@/utils/catchAsync";
import prisma from "@/utils/prisma";
import { LoginValidatorType, RegisterSendOtpValidatorType, VerifyOtpValidatorType } from "@/validator/auth.validator";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const gernerateTokenAndSendResponse = (user: User, res: Response) => {
  const token = jwtService.generateToken({ userId: user.id })
  res.status(200).
    json({
      status: true,
      message: 'Login success',
      token,
      data: {
        user
      }
    })
}

const registerAndSendOtp = catchAsync(async (req: Request<{}, {}, RegisterSendOtpValidatorType>, res: Response, next: NextFunction) => {
  const { name, phoneNumber, password } = req.body
  await prisma.$transaction(async (tx) => {
    //Check if user exist
    const userExist = await tx.user.findFirst({
      where: {
        phoneNumber
      }
    })
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: 'User already exist',
      })
    }

    //create a new user
    const user = await tx.user.create({
      data: {
        name,
        phoneNumber,
        password: await bcryptService.encryptPassword(password)
      }
    })
    //generate otp
    const otp = otpService.generateOtp()
    //send otp
    await otpService.sendOtp(otp, phoneNumber)
    //create a new otp
    await tx.otp.create({
      data: {
        otp: await bcryptService.encryptPassword(otp),
        userId: user.id
      }
    })

    res.status(200).json({
      status: true,
      message: 'Register success',
    })
  })
})

const verifyOtp = catchAsync(async (req: Request<{}, {}, VerifyOtpValidatorType>, res: Response, next: NextFunction) => {
  const { phoneNumber, otp } = req.body
  await prisma.$transaction(async (tx) => {
    //Check if user exist
    const userExist = await tx.user.findFirst({
      where: {
        phoneNumber
      }
    })
    if (!userExist) {
      return res.status(400).json({
        status: false,
        message: 'User already exist'
      })
    }

    //Check if otp exist
    const otpExist = await tx.otp.findFirst({
      where: {
        userId: userExist.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    if (!otpExist) {
      return res.status(400).json({
        status: false,
        message: 'Otp not found',
      })
    }

    //Check if otp match
    const otpMatch = await bcryptService.comparePassword(otp, otpExist.otp)
    if (!otpMatch) {
      return res.status(400).json({
        status: false,
        message: 'Otp not match',
      })
    }

    //update user status
    await tx.user.update({
      where: {
        id: userExist.id
      },
      data: {
        isVerified: true
      }
    })

    return gernerateTokenAndSendResponse(userExist, res)
  })
})

export const login = catchAsync(async (req: Request<{}, {}, LoginValidatorType>, res: Response, next: NextFunction) => {
  const { phoneNumber, password } = req.body
  const user = await prisma.user.findFirst({
    where: {
      phoneNumber
    }
  })
  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User not found',
    })
  }
  const passwordMatch = await bcryptService.comparePassword(password, user.password as string)
  if (!passwordMatch) {
    return res.status(400).json({
      status: false,
      message: 'Password not match',
    })
  }
  return gernerateTokenAndSendResponse(user, res)
})

export const me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  return gernerateTokenAndSendResponse(req.user as User, res)
})


export default {
  registerAndSendOtp,
  verifyOtp,
  login,
  me
}
