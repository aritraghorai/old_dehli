import pincodeController from '@/controller/pincode.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { PinCodeRequestBodySchema } from '@/validator/pincode.validator.js';
import { Router } from 'express';

const pincodeRouter = Router();

pincodeRouter.get(
  '/:pincode',
  ValidateRequestNew({
    paramSchema: PinCodeRequestBodySchema,
  }),
  pincodeController.getPincode,
);

pincodeRouter.get('/', pincodeController.getAllPincodes);

export default pincodeRouter;
