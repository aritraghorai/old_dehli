import { Option, OptionValue } from '@/entities/product.entity.js';
import catchAsync from '@/utils/catchAsync.js';
import { ProductOptionBody } from '@/validator/productoption.validator.js';
import { NextFunction, Request, Response } from 'express';

const createProductOption = catchAsync(
  async (
    req: Request<any, any, ProductOptionBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const option = Option.create({
      value: req.body.value,
    });
    await option.save();
    res.status(201).json({
      status: true,
      data: option,
    });
  },
);
const createProductOptionValue = catchAsync(
  async (
    req: Request<{ id: string }, any, ProductOptionBody>,
    res: Response,
    next: NextFunction,
  ) => {
    const optionValue = OptionValue.create({
      value: req.body.value,
      option: {
        id: req.params.id,
      },
    });
    await optionValue.save();
    res.status(201).json({
      status: true,
      data: optionValue,
    });
  },
);

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
  createProductOptionValue,
  createProductOption,
};
