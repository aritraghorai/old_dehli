import { Image } from '@/entities/image.entity.js';
import { ProductType } from '@/entities/product.entity.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import {
  NewProductTypeBody,
  UpdateProductTypeBody,
} from '@/validator/productType.validator.js';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import imageController from './image.controller.js';

const createProductType = catchAsync(
  async (req: Request<any, any, NewProductTypeBody>, res: Response) => {
    const { name, image, description } = req.body;
    const productType = ProductType.create({
      name,
      description,
      image: {
        id: image,
      },
      slug: faker.helpers.slugify(name),
    });
    await productType.save();
    res.status(201).json({
      status: true,
      data: productType,
      message: 'Product type created successfully',
    });
  },
);

const getAllProductTypes = catchAsync(async (req: Request, res: Response) => {
  const productTypes = await ProductType.find();
  res.status(200).json({
    status: true,
    data: productTypes,
    message: 'Product types fetched successfully',
  });
});

const updateProductType = catchAsync(
  async (
    req: Request<{ id: string }, any, UpdateProductTypeBody>,
    res: Response,
  ) => {
    const { name, image, description } = req.body;

    const productType = await ProductType.findOneById(req.params.id);
    if (!productType) {
      throw new AppError('Product type not found', 404);
    }

    productType.name = name || productType.name;
    productType.description = description || productType.description;
    if (image) {
      const getImage = await Image.findOneById(image);
      if (!getImage) {
        throw new AppError('Image not found', 404);
      }
      if (productType.image)
        await imageController.deleteImage(productType.image.id);
      productType.image = getImage;
    }
    await productType.save();
    res.status(201).json({
      status: true,
      message: 'Product type updated successfully',
      data: productType,
    });
  },
);

export default {
  createProductType,
  getAllProductTypes,
  updateProductType,
};
