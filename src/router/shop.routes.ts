import extractUser from '@/controller/extractUser.js';
import shopController from '@/controller/shop.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import {
  NewShopValidator,
  shopQuerySchema,
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

shopRouter.get('/all', shopController.getAllShopsAll);

shopRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: NewShopValidator,
  }),
  shopController.createNewShop,
);

export default shopRouter;
