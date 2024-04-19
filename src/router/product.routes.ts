import extractUser from '@/controller/extractUser.js';
import productController from '@/controller/product.controller.js';
import productItemController from '@/controller/productItem.controller.js';
import productTagController from '@/controller/productTag.controller.js';
import ValidateRequest from '@/middleware/ValidateRequest.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import {
  commonImageValidatorBody,
  praramIdValidator,
} from '@/validator/common.validator.js';
import {
  NewProductBodyValidator,
  ProductAndProductTagParamValidator,
  ProductItemValidator,
  UpdateProductItemValidator,
  UpdateProductRequestBodyValidator,
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
  '/all',
  ValidateRequest(undefined, productQuerySchema),
  productController.getAllProductAdmin,
);

productRouter.get(
  '/:id',
  ValidateRequest(undefined, undefined, praramIdValidator),
  productController.getProductById,
);
productRouter.use(extractUser);
productRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

productRouter.patch(
  '/:id',
  ValidateRequestNew({
    reqBodySchema: UpdateProductRequestBodyValidator,
    paramSchema: praramIdValidator,
  }),
  productController.updateProduct,
);

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

productRouter.patch(
  '/item/:id',
  ValidateRequestNew({
    reqBodySchema: UpdateProductItemValidator,
    paramSchema: praramIdValidator,
  }),
  productController.updateProductItem,
);

productRouter
  .route('/item/:id/image')
  .delete(
    ValidateRequestNew({
      paramSchema: praramIdValidator,
      reqBodySchema: commonImageValidatorBody,
    }),
    productItemController.deleteProductItemImage,
  )
  .post(
    ValidateRequestNew({
      paramSchema: praramIdValidator,
      reqBodySchema: commonImageValidatorBody,
    }),
    productItemController.addProductItemImage,
  );

export default productRouter;
