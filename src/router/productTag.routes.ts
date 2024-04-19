import extractUser from '@/controller/extractUser.js';
import productTagController from '@/controller/productTag.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import { CreateProductTagValidator } from '@/validator/productTag.validator.js';
import { Router } from 'express';

const productTagRouter = Router();

productTagRouter.get('/', productTagController.getAllProductTag);

productTagRouter.use(extractUser);
productTagRouter.use(restrictUser(ROLES.SUPER_ADMIN, ROLES.ADMIN));

productTagRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: CreateProductTagValidator,
  }),
  productTagController.createProductTag,
);

export default productTagRouter;
