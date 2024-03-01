import catagoryController from '@/controller/catagory.controller.js';
import extractUser from '@/controller/extractUser.js';
import ValidateRequest from '@/middleware/ValidateRequest.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import {
  NewCategoryValidator,
  UpdateCategoryValidator,
} from '@/validator/category.validator.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import { Router } from 'express';

const catagoryRouter = Router();

catagoryRouter.get('/', catagoryController.getAllCatagory);

catagoryRouter.use(extractUser);
catagoryRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

catagoryRouter.post(
  '/',
  ValidateRequest(NewCategoryValidator),
  catagoryController.createCatagory,
);
catagoryRouter.route('/:id').patch(
  ValidateRequestNew({
    reqBodySchema: UpdateCategoryValidator,
    paramSchema: praramIdValidator,
  }),
  catagoryController.updateCatagory,
);
catagoryRouter.get('/all', catagoryController.getAllCatagoryAll);

export default catagoryRouter;
