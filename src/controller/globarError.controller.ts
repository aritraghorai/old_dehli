import AppError from '@/utils/AppError.js';
import env from '@/utils/env.js';
import Log from '@/utils/log.js';
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const NODE_ENV = env.NODE_ENV;

const sentErrorDev = (err: AppError, res: Response) => {
  Log.error(err);
  res.status(err.statusCode).json({
    message: err.message,
    error: err,
    status: false,
    stack: err.stack,
  });
};
const sentErrorProd = (err: AppError, res: Response) => {
  if (err.isOperational)
    res.status(err.statusCode).json({
      message: err.message,
    });
  else
    res.status(500).json({
      status: false,
      message: 'Something Happen Very Wrong',
    });
};
//*This Method for handle cast errror
const handleCaseError = (err: any) => {
  const message = `Invalid ${err.kind}:${err.value}`;
  return new AppError(message, 400);
};
//*This Method for handle duplicate entry
const handleDuplicateFieldsDb = (err: any) => {
  const message = `Duplicate field value ${err.keyValue.name}`;
  return new AppError(message, 400);
};
//*This is for field validation error
const handleValidationError = (err: any) => {
  const errors = Object.values(err.errors).map((item: any) => {
    return item.message;
  });
  const message = `Invlid Inpur Data ${errors.join('.')}`;
  return new AppError(message, 400);
};
//*Invalid Jwt token error
const handleJWTTokenError = () =>
  new AppError('Invalid Token Please Login agaim', 401);
//*Handle Invalid Token error
const handleTokenExpireError = () =>
  new AppError('Token Has Been Invalid', 401);

//*Global Error Handler
export default function globalErrorHandler(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  Log.error(err);

  if (NODE_ENV === 'development') {
    sentErrorDev(err, res);
  } else {
    //*Mongose find method object error
    //*reference:https://github.com/Automattic/mongoose/issues/5354

    let error = { ...err };
    if (err.name === 'CastError' || err.name === 'BSONTypeError') {
      error = handleCaseError(error);
    }
    if (err.code === 11000) {
      error = handleDuplicateFieldsDb(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTTokenError();
    }
    if (err.name === 'TokenExpiredError') error = handleTokenExpireError();
    sentErrorProd(error, res);
  }

  next();
}

export const fileUploadErrorHander = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return next(new AppError('File too large', 400));
  } else {
    next(err);
  }
};
