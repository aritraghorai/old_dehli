import extractUser from '@/controller/extractUser.js';
import zonesController from '@/controller/zones.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
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

export default zoneRouter;
