import { ProductItem } from '@/entities/product.entity.js';
import catchAsync from '@/utils/catchAsync.js';
import { CommonImageValidatorBodyType } from '@/validator/common.validator.js';
import { Request, Response } from 'express';
import imageController from './image.controller.js';
import AppError from '@/utils/AppError.js';
import { Image } from '@/entities/image.entity.js';

export const deleteProductItemImage = catchAsync(
  async (
    req: Request<{ id: string }, any, CommonImageValidatorBodyType>,
    res: Response,
  ) => {
    const { id } = req.params;
    const productItme = await ProductItem.findOneById(id);
    const { images } = req.body;
    if (!productItme) {
      res.status(404).json({
        status: false,
        message: 'ProductItem not found',
      });
      return;
    }
    for (const i of images) {
      await imageController.deleteImage(i);
      productItme.images = productItme.images.filter(image => image.id !== i);
    }
    await productItme.save();
    res.status(200).json({
      status: true,
      data: productItme,
    });
  },
);

export const addProductItemImage = catchAsync(
  async (
    req: Request<{ id: string }, any, CommonImageValidatorBodyType>,
    res: Response,
  ) => {
    const { id } = req.params;
    const { images: images } = req.body;
    const productItme = await ProductItem.findOneById(id);
    for (const i of images) {
      const findImage = await Image.findOneById(i);
      if (!findImage) {
        throw new AppError('Image not found', 404);
      }
      productItme.images.push(findImage);
    }
    await productItme.save();
    res.status(200).json({
      status: true,
      data: productItme,
    });
  },
);

export default {
  addProductItemImage,
  deleteProductItemImage,
};
