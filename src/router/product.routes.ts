import productController from '@/controller/product.controller.js';
import ValidateRequest from '@/middleware/ValidateRequest.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import { productQuerySchema } from '@/validator/product.validator.js';
import { Router } from 'express';

const productRouter = Router();

productRouter.get(
  '/',
  ValidateRequest(undefined, productQuerySchema),
  productController.getAllProduct,
);
productRouter.get(
  '/:id',
  ValidateRequest(undefined, undefined, praramIdValidator),
  productController.getProductById,
);

export default productRouter;
