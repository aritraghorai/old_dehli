import shopController from '@/controller/shop.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { shopQuerySchema } from '@/validator/shop.validator.js';
import { Router } from 'express';

const shopRouter = Router();

shopRouter.get(
  '/',
  ValidateRequestNew({
    queryParamSchema: shopQuerySchema,
  }),
  shopController.getAllShops,
);
shopRouter.get('/all', shopController.getAllShopsAll);

export default shopRouter;
