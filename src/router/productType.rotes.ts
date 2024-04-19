import extractUser from '@/controller/extractUser.js';
import productTypeController from '@/controller/productType.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import {
  NewProductTypeBodySchema,
  UpdateProductTypeBodySchema,
} from '@/validator/productType.validator.js';
import { Router } from 'express';

const productTypeRouter = Router();

productTypeRouter.use(extractUser);
productTypeRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

productTypeRouter
  .route('/')
  .post(
    ValidateRequestNew({
      reqBodySchema: NewProductTypeBodySchema,
    }),
    productTypeController.createProductType,
  )
  .get(productTypeController.getAllProductTypes);

productTypeRouter.route('/:id').patch(
  ValidateRequestNew({
    reqBodySchema: UpdateProductTypeBodySchema,
    paramSchema: praramIdValidator,
  }),
  productTypeController.updateProductType,
);

export default productTypeRouter;
