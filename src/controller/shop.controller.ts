import { Shop } from '@/entities/product.entity.js';
import catchAsync from '@/utils/catchAsync.js';
import {
  NewShopValidatorType,
  ShopQuery,
  UpdateShopValidatorType,
} from '@/validator/shop.validator.js';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { Like } from 'typeorm';
import imageController from './image.controller.js';
import { CommonImageValidatorBodyType } from '@/validator/common.validator.js';
import { Image } from '@/entities/image.entity.js';
import AppError from '@/utils/AppError.js';

const createNewShop = catchAsync(
  async (req: Request<any, any, NewShopValidatorType>, res: Response) => {
    const { name, description, images } = req.body;
    const shop = Shop.create({
      name: name,
      description: description,
      slug: faker.helpers.slugify(name),
      images: images.map(image => ({ id: image })),
    });
    await shop.save();
    res.status(201).json({
      status: true,
      data: shop,
    });
  },
);

const getAllShops = catchAsync(
  async (req: Request<any, any, any, ShopQuery>, res: Response) => {
    const { limit, page, search } = req.query;
    const [data, total] = await Shop.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        name: search ? Like(`%${search}%`) : Like(`%%`),
      },
      order: {
        name: 'ASC',
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
  const data = await Shop.find({
    order: {
      name: 'ASC',
    },
  });
  res.status(200).json({
    status: true,
    data,
  });
});

const updateShop = catchAsync(
  async (
    req: Request<{ id: string }, any, UpdateShopValidatorType>,
    res: Response,
  ) => {
    const { id } = req.params;
    const shop = await Shop.findOneOrFail({
      where: {
        id,
      },
    });
    const { isActive, name, description } = req.body;
    shop.isActive = isActive;
    shop.name = name || shop.name;
    shop.description = description || shop.description;
    shop.slug = faker.helpers.slugify(shop.name);
    await shop.save();
    res.status(200).json({
      status: true,
      data: shop,
    });
  },
);

// shop image delete
export const deleteShopImage = catchAsync(
  async (
    req: Request<{ id: string }, any, CommonImageValidatorBodyType>,
    res: Response,
  ) => {
    console.log('deleteShopImage', req.params);
    const { id } = req.params;
    const shop = await Shop.findOneById(id);
    const { images } = req.body;
    if (!shop) {
      res.status(404).json({
        status: false,
        message: 'Shop not found',
      });
      return;
    }
    for (const i of images) {
      await imageController.deleteImage(i);
      shop.images = shop.images.filter(image => image.id !== i);
    }
    await shop.save();
    res.status(200).json({
      status: true,
      data: shop,
    });
  },
);

export const addShopImage = catchAsync(
  async (
    req: Request<{ id: string }, any, CommonImageValidatorBodyType>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { images: images } = req.body;
    console.log('addShopImage', id, images);
    const shop = await Shop.findOneById(id);
    for (const i of images) {
      const findImage = await Image.findOneById(i);
      if (!findImage) {
        throw new AppError('Image not found', 404);
      }
      shop.images.push(findImage);
    }
    await shop.save();
    res.status(200).json({
      status: true,
      data: shop,
    });
  },
);

export default {
  getAllShops,
  getAllShopsAll,
  createNewShop,
  updateShop,
  deleteShopImage,
  addShopImage,
};
