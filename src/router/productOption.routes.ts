import extractUser from '@/controller/extractUser.js';
import productOptionController from '@/controller/productOption.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import { ProductOptionValidator } from '@/validator/productoption.validator.js';
import { Router } from 'express';

const productOptionRoute = Router();

productOptionRoute.use(extractUser);

productOptionRoute.get('/', productOptionController.getAllProductOptions);

productOptionRoute.use(extractUser);

productOptionRoute.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: ProductOptionValidator,
  }),
  productOptionController.createProductOption,
);
productOptionRoute.post(
  '/:id/value',
  ValidateRequestNew({
    reqBodySchema: ProductOptionValidator,
    paramSchema: praramIdValidator,
  }),
  productOptionController.createProductOptionValue,
);

export default productOptionRoute;
