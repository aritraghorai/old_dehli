import extractUser from '@/controller/extractUser.js';
import timeslotController from '@/controller/timeslot.controller.js';
import ValidateRequestNew from '@/middleware/ValidateRequestNew.js';
import { TimeSlotRequestSchema } from '@/validator/timeslot.validator.js';
import { Router } from 'express';

const timeSlotRouter = Router();

timeSlotRouter.use(extractUser);

timeSlotRouter
  .route('/')
  .post(
    ValidateRequestNew({
      reqBodySchema: TimeSlotRequestSchema,
    }),
    timeslotController.createNewTimeSlot,
  )
  .get(timeslotController.getAllTimeSlots);

timeSlotRouter.route('/:id').patch(
  ValidateRequestNew({
    reqBodySchema: TimeSlotRequestSchema,
  }),
  timeslotController.editTimeSlot,
);

export default timeSlotRouter;
