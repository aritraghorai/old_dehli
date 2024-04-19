import extractUser from '@/controller/extractUser.js';
import userController from '@/controller/user.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import {
  NewProfileValidator,
  UpdateProfileValidator,
} from '@/validator/profile.validator.js';
import { Router } from 'express';

const userRouter = Router();

userRouter.use(extractUser);

userRouter
  .route('/profile')
  .post(
    ValidateRequestNew({
      reqBodySchema: NewProfileValidator,
    }),
    userController.createProfile,
  )
  .patch(
    ValidateRequestNew({
      reqBodySchema: UpdateProfileValidator,
    }),
    userController.updateUserProfile,
  );
userRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));
userRouter.get('/', userController.getAllUser);

export default userRouter;
