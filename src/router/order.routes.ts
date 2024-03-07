import extractUser from '@/controller/extractUser.js';
import orderController from '@/controller/orderController.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import { praramIdValidator, queryPageValidator } from '@/validator/common.validator.js';
import { OrderBodyValidator, UpdateOrderBodyValidator } from '@/validator/order.validator.js';
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
orderRouter.get(
  '/',
  ValidateRequestNew({
    queryParamSchema: queryPageValidator,
  }),
  orderController.getOrders,
);
orderRouter.use(extractUser);
orderRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));
orderRouter.get('/all', orderController.getAllOrdersAdmin);
orderRouter.patch(
  '/:id',
  ValidateRequestNew({
    reqBodySchema: UpdateOrderBodyValidator,
    paramSchema: praramIdValidator
  }),
  orderController.updateOrder,
);

export default orderRouter;
