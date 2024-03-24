import extractUser from '@/controller/extractUser.js';
import userAddressController from '@/controller/userAddress.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import {
  addressValidator,
  updateAddressValidator,
} from '@/validator/address.validator.js';
import { praramIdValidator } from '@/validator/common.validator.js';
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
userAddressRouter.get(
  '/default/:id',
  ValidateRequestNew({
    paramSchema: praramIdValidator,
  }),
  userAddressController.setDefaultAddress,
);
userAddressRouter
  .route('/:id')
  .delete(
    ValidateRequestNew({ paramSchema: praramIdValidator }),
    userAddressController.deleteAddress,
  )
  .put(
    ValidateRequestNew({
      reqBodySchema: updateAddressValidator,
      paramSchema: praramIdValidator,
    }),
    userAddressController.updateAddress,
  );

export default userAddressRouter;
