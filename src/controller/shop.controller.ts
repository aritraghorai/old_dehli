import { Shop } from '@/entities/product.entity.js';
import catchAsync from '@/utils/catchAsync.js';
import { ShopQuery } from '@/validator/shop.validator.js';
import { Request, Response } from 'express';
import { Like } from 'typeorm';

const getAllShops = catchAsync(
  async (req: Request<any, any, any, ShopQuery>, res: Response) => {
    const { limit, page, search } = req.query;
    const [data, total] = await Shop.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: search ? Like(`%${search}%`) : Like(`%%`),
      },
    });
    res.status(200).json({
      status: true,
      data,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    });
  },
);
const getAllShopsAll = catchAsync(async (req: Request, res: Response) => {
  const data = await Shop.find();
  res.status(200).json({
    status: true,
    data,
  });
});

export default {
  getAllShops,
  getAllShopsAll,
};
