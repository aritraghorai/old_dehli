import { User } from '@/entities/user.entiry.js';
import { userRepository } from '@/orm/datasources/index.js';
import jwtService from '@/services/jwt.service.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { NextFunction, Request, Response } from 'express';

declare global {
  interface Request {
    user?: User;
  }
}

const extractUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new AppError('Please login to continue', 401));
    }
    const decoded = await jwtService.verifyToken(token);
    console.log(decoded);
    const user = await userRepository.findOne({
      where: {
        id: decoded.userId,
      }
    });
    if (!user) {
      return next(new AppError('User not found', 401));
    }
    req.user = user;
    next();
  },
);

export default extractUser;
