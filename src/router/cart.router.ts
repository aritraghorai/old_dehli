import cartController from '@/controller/cart.controller.js';
import extractUser from '@/controller/extractUser.js';
import ValidateRequest from '@/middleware/ValidateRequest.js';
import { addToCardBodyValidator } from '@/validator/cart.validator.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import { Router } from 'express';

const cardRouter = Router();

cardRouter.use(extractUser);

cardRouter.post(
  '/',
  ValidateRequest(addToCardBodyValidator),
  cartController.addToCart,
);
cardRouter.get('/', cartController.getCurrentLoginUserCart);
cardRouter.delete('/clear', cartController.clearCart);
cardRouter.delete(
  '/:id',
  ValidateRequest(undefined, undefined, praramIdValidator),
  cartController.deleteCartItem,
);

export default cardRouter;
