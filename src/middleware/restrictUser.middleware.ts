import { User } from '@/entities/user.entiry.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { NextFunction, Request, Response } from 'express';

const restrictUser = (...roles: string[]) => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const user = req.user as User;
      if (roles.every(role => user.role.some(r => r.name === role))) {
        return next(new AppError('You are not authorized', 403));
      }
      next();
    },
  );
};

export default restrictUser;
