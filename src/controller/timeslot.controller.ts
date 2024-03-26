import { TimeSlot } from '@/entities/timeslot.entity.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import { TimeSlotRequest } from '@/validator/timeslot.validator.js';
import { NextFunction, Request, Response } from 'express';

const getHourWithAmOrPm = (hour: number) => {
  return `${hour % 12} ${hour < 12 ? 'AM' : 'PM'}`;
};

const getSlotName = (startTime: Date, endTime: Date) => {
  const start = startTime.getHours();
  const end = endTime.getHours();
  return `${getHourWithAmOrPm(start)} - ${getHourWithAmOrPm(end)}`;
};

const createNewTimeSlot = catchAsync(
  async (
    req: Request<any, any, TimeSlotRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { startTime, endTime } = req.body;

    startTime.setMinutes(0);
    startTime.setSeconds(0);
    endTime.setSeconds(0);
    endTime.setMinutes(0);

    console.log(startTime.getHours(), endTime.getHours());

    if (startTime.getHours() >= endTime.getHours()) {
      throw new AppError('Start Hour Must be less than End Hour', 400);
    }

    const newTimeSlot = TimeSlot.create({
      startTime: startTime,
      endTime: endTime,
      slot: getSlotName(startTime, endTime),
    });
    await newTimeSlot.save();
    res.status(201).json({
      status: true,
      message: 'Time slot created successfully',
      data: newTimeSlot,
    });
  },
);

const editTimeSlot = catchAsync(
  async (
    req: Request<{ id: string }, any, TimeSlotRequest>,
    res: Response,
    next: NextFunction,
  ) => {
    const { startTime, endTime } = req.body;
    const { id } = req.params;

    startTime.setMinutes(0);
    startTime.setSeconds(0);
    endTime.setSeconds(0);
    endTime.setMinutes(0);

    if (startTime.getHours() >= endTime.getHours()) {
      throw new AppError('Start Hour Must be less than End Hour', 400);
    }

    const timeSlot = await TimeSlot.findOne({
      where: { id },
    });
    if (!timeSlot) {
      return res.status(404).json({
        status: false,
        message: 'Time slot not found',
      });
    }
    timeSlot.startTime = startTime;
    timeSlot.endTime = endTime;
    timeSlot.slot = getSlotName(startTime, endTime);
    await timeSlot.save();
    res.status(200).json({
      status: true,
      message: 'Time slot updated successfully',
      data: timeSlot,
    });
  },
);

export const getAllTimeSlots = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const timeSlots = await TimeSlot.find({
      order: {
        startTime: 'ASC',
      },
    });

    res.status(200).json({
      status: true,
      data: timeSlots,
    });
  },
);

export default {
  createNewTimeSlot,
  editTimeSlot,
  getAllTimeSlots,
  getSlotName,
};
