import extractUser from '@/controller/extractUser.js';
import productController from '@/controller/product.controller.js';
import productTagController from '@/controller/productTag.controller.js';
import ValidateRequest from '@/middleware/ValidateRequest.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import {
  NewProductBodyValidator,
  ProductAndProductTagParamValidator,
  ProductItemValidator,
  productQuerySchema,
} from '@/validator/product.validator.js';
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
productRouter.use(extractUser);

productRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: NewProductBodyValidator,
  }),
  productController.createProduct,
);

// product tag routes
productRouter
  .route('/:productId/tag/:productTagId')
  .delete(
    ValidateRequestNew({
      paramSchema: ProductAndProductTagParamValidator,
    }),
    productTagController.deleteNewProductTag,
  )
  .post(
    ValidateRequestNew({
      paramSchema: ProductAndProductTagParamValidator,
    }),
    productTagController.addNewProductTagToProduct,
  );
productRouter.post(
  '/:id/item',
  ValidateRequest(ProductItemValidator, undefined, praramIdValidator),
  productController.addNewProductItem,
);

export default productRouter;
