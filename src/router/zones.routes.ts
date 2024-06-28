import extractUser from '@/controller/extractUser.js';
import zonesController from '@/controller/zones.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import restrictUser from '@/middleware/restrictUser.middleware.js';
import { uploadExcel } from '@/middleware/uploadFile.middleware.js';
import { ROLES } from '@/utils/Constant.js';
import { praramIdValidator } from '@/validator/common.validator.js';
import { NewZoneValidator } from '@/validator/zones.validator.js';
import { Router } from 'express';

const zoneRouter = Router();

zoneRouter.use(extractUser);
zoneRouter.use(restrictUser(ROLES.ADMIN, ROLES.SUPER_ADMIN));

zoneRouter
  .route('/')
  .post(
    ValidateRequestNew({
      reqBodySchema: NewZoneValidator,
    }),
    zonesController.createNewZone,
  )
  .get(zonesController.getAllZones);

zoneRouter
  .route('/:id')
  .put(
    ValidateRequestNew({
      reqBodySchema: NewZoneValidator,
      paramSchema: praramIdValidator,
    }),
    zonesController.updateZoneById,
  )
  .delete(
    ValidateRequestNew({
      paramSchema: praramIdValidator,
    }),
    zonesController.deleteZoneById,
  );

zoneRouter.post(
  '/multiple',
  uploadExcel.single('file'),
  zonesController.uploadOrUpdateMultipleZones,
);

export default zoneRouter;
