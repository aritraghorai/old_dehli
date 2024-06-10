import extractUser from '@/controller/extractUser.js';
import zonesController from '@/controller/zones.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.ts';
import { uploadExcel } from '@/middleware/uploadFile.middleware.ts';
import { ROLES } from '@/utils/Constant.ts';
import { praramIdValidator } from '@/validator/common.validator.js';
import { NewZoneValidator } from '@/validator/zones.validator.js';
import { Router } from 'express';

const zoneRouter = Router();

zoneRouter.use(extractUser);

zoneRouter
  .route('/')
  .post(
    ValidateRequestNew({
      reqBodySchema: NewZoneValidator,
    }),
    zonesController.createNewZone,
  )
  .get(zonesController.getAllZones);

zoneRouter.route('/:id').put(
  ValidateRequestNew({
    reqBodySchema: NewZoneValidator,
    paramSchema: praramIdValidator,
  }),
  zonesController.updateZoneById,
);

zoneRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

zoneRouter.post(
  '/multiple',
  uploadExcel.single('file'),
  zonesController.uploadOrUpdateMultipleZones,
);

export default zoneRouter;
