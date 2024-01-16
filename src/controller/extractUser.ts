import jwtService from "@/services/jwt.service";
import AppError from "@/utils/AppError";
import catchAsync from "@/utils/catchAsync";
import prisma from "@/utils/prisma";
import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";


declare global {
  interface Request {
    user?: User
  }
}

const extractUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers?.authorization?.split(' ')[1]
  if (!token) {
    return next(new AppError('Please login to continue', 401))
  }
  const decoded = await jwtService.verifyToken(token)
  const user = await prisma.user.findFirst({ where: { id: decoded.userId } })
  if (!user) {
    return next(new AppError('User not found', 401))
  }
  req.user = user
  next()
})

export default extractUser
