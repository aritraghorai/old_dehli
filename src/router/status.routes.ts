import extractUser from '@/controller/extractUser.js';
import statusController from '@/controller/status.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import {
  NewStatusValidator,
  UpdateStatusValidator,
} from '@/validator/status.validator.js';
import { Router } from 'express';

const statusRouter = Router();

statusRouter.get('/', statusController.getStatus);

statusRouter.use(extractUser);

statusRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

statusRouter.post(
  '/',
  ValidateRequestNew({
    reqBodySchema: NewStatusValidator,
  }),
  statusController.createStatus,
);

statusRouter
  .route('/:id')
  .patch(
    ValidateRequestNew({
      reqBodySchema: UpdateStatusValidator,
      paramSchema: praramIdValidator,
    }),
    statusController.updateStatus,
  )
  .delete(
    ValidateRequestNew({
      paramSchema: praramIdValidator,
    }),
    statusController.deleteStatus,
  );

export default statusRouter;
