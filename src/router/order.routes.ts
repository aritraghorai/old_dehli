import extractUser from '@/controller/extractUser.js';
import orderController from '@/controller/orderController.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { queryPageValidator } from '@/validator/common.validator.js';
import { OrderBodyValidator } from '@/validator/order.validator.js';
import { Router } from 'express';

const orderRouter = Router();

orderRouter.use(extractUser);

orderRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: OrderBodyValidator,
  }),
  orderController.createOrder,
);
orderRouter.get('/', ValidateRequestNew({
  queryParamSchema: queryPageValidator
}), orderController.getOrders);

export default orderRouter;
