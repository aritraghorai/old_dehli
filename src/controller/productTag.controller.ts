import { Product, ProductTag } from '@/entities/product.entity.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { ProductAndProductTagParam } from '@/validator/product.validator.js';
import { CreateProductTagValidatorType } from '@/validator/productTag.validator.js';
import { Request, Response } from 'express';

const createProductTag = catchAsync(
  async (
    req: Request<any, any, CreateProductTagValidatorType>,
    res: Response,
  ) => {
    const { name, description } = req.body;
    const slug = name.toLowerCase().replace(/ /g, '-');
    const productTag = ProductTag.create({
      name,
      slug,
      description,
    });
    await productTag.save();
    res.status(201).json({
      status: true,
      data: productTag,
    });
  },
);

const getAllProductTag = catchAsync(async (req: Request, res: Response) => {
  const productTags = await ProductTag.find();
  res.status(200).json({
    status: true,
    data: productTags,
  });
});
//All product Internal Route
const deleteNewProductTag = catchAsync(
  async (
    req: Request<ProductAndProductTagParam, any, CreateProductTagValidatorType>,
    res: Response,
  ) => {
    const { productId, productTagId } = req.params;
    const product = await Product.findOneBy({
      id: productId,
    });
    product.productTag = product.productTag.filter(
      tag => tag.id !== productTagId,
    );
    await product.save();
    res.status(200).json({
      status: true,
      data: product,
    });
  },
);
const addNewProductTagToProduct = catchAsync(
  async (
    req: Request<ProductAndProductTagParam, any, CreateProductTagValidatorType>,
    res: Response,
  ) => {
    const { productId, productTagId } = req.params;
    const productTag = await ProductTag.findOneById(productTagId);
    if (!productTag) {
      throw new AppError('Product Tag not found', 404);
    }
    const product = await Product.findOneBy({
      id: productId,
    });
    product.productTag.push(productTag);
    await product.save();
    res.status(201).json({
      status: true,
      data: product,
    });
  },
);

export default {
  createProductTag,
  getAllProductTag,
  deleteNewProductTag,
  addNewProductTagToProduct,
};
