import extractUser from '@/controller/extractUser.js';
import shopController from '@/controller/shop.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import {
  commonImageValidatorBody,
  praramIdValidator,
} from '@/validator/common.validator.js';
import {
  NewShopValidator,
  shopQuerySchema,
  updateShopValidator,
} from '@/validator/shop.validator.js';
import { Router } from 'express';

const shopRouter = Router();

shopRouter.get(
  '/',
  ValidateRequestNew({
    queryParamSchema: shopQuerySchema,
  }),
  shopController.getAllShops,
);
shopRouter.use(extractUser);
shopRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

shopRouter.get('/all', shopController.getAllShopsAll);

shopRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: NewShopValidator,
  }),
  shopController.createNewShop,
);

shopRouter.put(
  '/:id',
  ValidateRequestNew({
    paramSchema: praramIdValidator,
    reqBodySchema: updateShopValidator,
  }),
  shopController.updateShop,
);
shopRouter
  .route('/:id/image')
  .delete(
    ValidateRequestNew({
      paramSchema: praramIdValidator,
      reqBodySchema: commonImageValidatorBody,
    }),
    shopController.deleteShopImage,
  )
  .post(
    ValidateRequestNew({
      paramSchema: praramIdValidator,
      reqBodySchema: commonImageValidatorBody,
    }),
    shopController.addShopImage,
  );

export default shopRouter;
