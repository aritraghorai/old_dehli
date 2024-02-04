import { Product } from '@/entities/product.entity.js';
import catchAsync from '@/utils/catchAsync.js';
import { ProductQuery } from '@/validator/product.validator.js';
import { NextFunction, Request, Response } from 'express';
import { Like, MoreThan } from 'typeorm';

const getAllProduct = catchAsync(
  async (
    req: Request<{}, {}, {}, ProductQuery>,
    res: Response,
    next: NextFunction,
  ) => {
    const { limit, page, category, search, shop } = req.query;
    const [products, total] = await Product.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: search ? Like(`%${search}%`) : Like(`%%`),
        productItems: {
          stock: MoreThan(0),
        },
        category: {
          slug: category ? Like(`%${category}%`) : Like(`%%`),
        },
        shop:{
          slug: shop ? Like(`%${shop}%`) : Like(`%%`),
        }
      },
      relations: {
        category: true,
        shop: true,
      },
    });
    res.status(200).json({
      status: true,
      data: products,
      total,
      page,
      limit,
      totalPage: Math.ceil(total / limit),
    });
  },
);

const getProductById = catchAsync(
  async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;
    const product = await Product.findOne({
      where: {
        id,
      },
      relations: {
        productItems: {
          productConfig: {
            option: true,
            optionValue: true,
          },
        },
        category: true,
      },
    });
    res.status(200).json({
      status: true,
      data: product,
    });
  },
);

export default {
  getAllProduct,
  getProductById,
};
