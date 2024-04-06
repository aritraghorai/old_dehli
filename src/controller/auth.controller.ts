import { Otp } from "@/entities/otp.entity.js";
import { User } from "@/entities/user.entiry.js";
import bcryptService from "@/services/bcrypt.service.js";
import jwtService from "@/services/jwt.service.js";
import otpService from "@/services/otp.service.js";
import { myDataSource } from "@/utils/app-data-source.js";
import catchAsync from "@/utils/catchAsync.js";
import { ForgotPasswordValidatorType, LoginValidatorType, RegisterSendOtpValidatorType, ResetPasswordValidatorType, VerifyOtpValidatorType } from "@/validator/auth.validator.js";
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
  const { name, phoneNumber, password, email } = req.body

  myDataSource.transaction(async (tx) => {
    const userRepo = tx.getRepository(User)
    const otpRepo = tx.getRepository(Otp)
    //Check if user exist
    const userExist = await userRepo.findOne({
      where: [
        {
          phoneNumber
        },
        {
          email
        }
      ]
    })
    if (userExist) {
      return res.status(400).json({
        status: false,
        message: 'User With This Phone Number Or Email Already Exist',
      })
    }
    //create a new user
    const user = userRepo.create({
      name,
      phoneNumber,
      email,
      password: await bcryptService.encryptPassword(password)
    })
    await userRepo.save(user)
    //generate otp
    const otp = otpService.generateOtp()
    //send otp
    await otpService.sendOtp(otp, email)
    //create a new otp
    const otpEntity = otpRepo.create({
      otp: await bcryptService.encryptPassword(otp),
      user: user
    })
    await otpRepo.save(otpEntity)
    res.status(200).json({
      status: true,
      message: 'Register success',
    })
  })
})

const verifyOtp = catchAsync(async (req: Request<{}, {}, VerifyOtpValidatorType>, res: Response, next: NextFunction) => {
  const { email, otp } = req.body

  await myDataSource.transaction(async (tx) => {
    const userRepo = tx.getRepository(User)
    const otpRepo = tx.getRepository(Otp)
    //Check if user exist
    const userExist = await userRepo.findOne({
      where: {
        email
      },
    })
    if (!userExist) {
      return res.status(400).json({
        status: false,
        message: 'User not exist',
      })
    }
    console.log(userExist)
    //Check if otp exist
    const otpExist = await otpRepo.findOne({
      where: {
        user: {
          id: userExist.id
        }
      },
      order: {
        createdAt: 'DESC'
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
    await userRepo.update({
      id: userExist.id
    }, {
      isVerified: true
    })
    //delete otp
    await otpRepo.delete({
      user: {
        id: userExist.id
      }
    })

    return gernerateTokenAndSendResponse(userExist, res)

  })
})

export const login = catchAsync(async (req: Request<{}, {}, LoginValidatorType>, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const userRepo = myDataSource.getRepository(User)
  const user = await userRepo.findOne({
    where: {
      email,
      isVerified: true
    }
  })
  if (!user) {
    return res.status(400).json({
      status: false,
      message: 'User not exist',
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

const forgotPassword = catchAsync(async (req: Request<any, any, ForgotPasswordValidatorType>, res: Response, next: NextFunction) => {
  const { email } = req.body
  const userRepo = myDataSource.getRepository(User)
  const otpRepo = myDataSource.getRepository(Otp)
  const user = await userRepo.findOne({
    where: {
      email
    }
  })
  if (!user) {
    return res.status(400).json({
      status: false,
      message: 'User not exist',
    })
  }
  const otp = otpService.generateOtp()
  await otpService.sendOtp(otp, email)
  await otpRepo.save(otpRepo.create({
    otp: await bcryptService.encryptPassword(otp),
    user
  }))
  return res.status(200).json({
    status: true,
    message: 'Otp sent to your email',
  })
})

const resetPassword = catchAsync(async (req: Request<any, any, ResetPasswordValidatorType>, res: Response, next: NextFunction) => {
  const { email, password, otp } = req.body
  await myDataSource.transaction(async (tx) => {
    const userRepo = tx.getRepository(User)
    const otpRepo = tx.getRepository(Otp)
    //Check if user exist
    const userExist = await userRepo.findOne({
      where: {
        email
      },
    })
    if (!userExist) {
      return res.status(400).json({
        status: false,
        message: 'User not exist',
      })
    }
    //Check if otp exist
    const otpExist = await otpRepo.findOne({
      where: {
        user: {
          id: userExist.id
        }
      },
      order: {
        createdAt: 'DESC'
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
    //update user password
    await userRepo.update({
      id: userExist.id
    }, {
      password: await bcryptService.encryptPassword(password)
    })
    //delete otp
    await otpRepo.delete({
      user: {
        id: userExist.id
      }
    })

    return res.status(200).json({
      status: true,
      message: 'Password updated',
    })
  })
})

export const me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  return gernerateTokenAndSendResponse(req.user as User, res)
})


export default {
  registerAndSendOtp,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  me
}
