import extractUser from '@/controller/extractUser.js';
import productTagController from '@/controller/productTag.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { CreateProductTagValidator } from '@/validator/productTag.validator.js';
import { Router } from 'express';

const productTagRouter = Router();

productTagRouter.get('/', productTagController.getAllProductTag);

productTagRouter.use(extractUser);

productTagRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: CreateProductTagValidator,
  }),
  productTagController.createProductTag,
);

export default productTagRouter;
