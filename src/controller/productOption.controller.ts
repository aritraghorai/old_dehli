import { Option } from '@/entities/product.entity.js';
import catchAsync from '@/utils/catchAsync.js';
import { NextFunction, Request, Response } from 'express';

const getAllProductOptions = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = await Option.find({
      relations: {
        Options: true,
      },
    });
    res.status(200).json({
      status: true,
      data: options,
    });
  },
);

export default {
  getAllProductOptions,
};
