import extractUser from '@/controller/extractUser.js';
import userAddressController from '@/controller/userAddress.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { addressValidator } from '@/validator/address.validator.js';
import { Router } from 'express';

const userAddressRouter = Router();

userAddressRouter.use(extractUser);

userAddressRouter
  .post(
    '/',
    ValidateRequestNew({
      reqBodySchema: addressValidator,
    }),
    userAddressController.addNewAddress,
  )
  .get('/', userAddressController.getUserAddress);

export default userAddressRouter;
