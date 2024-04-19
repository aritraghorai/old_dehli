import { Status } from "@/entities/status.entity.ts";
import AppError from "@/utils/AppError.ts";
import catchAsync from "@/utils/catchAsync.ts";
import { NewStatus, UpdateStatus } from "@/validator/status.validator.ts";
import { Request, Response } from "express";

const createStatus = catchAsync(async (req: Request<any, any, NewStatus>, res: Response) => {
  const newStatus = await Status.create({
    name: req.body.name,
    video_url: req.body.video_url,
    description: req.body.description,
  }).save();
  res.status(201).json({
    status: true,
    data: newStatus,
    message: "Status created successfully",
  });
})

const updateStatus = catchAsync(async (req: Request<{ id: string }, any, UpdateStatus>, res: Response) => {
  const status = await Status.findOne({
    where: {
      id: req.params.id
    }
  });

  if (!status) {
    throw new AppError("Status not found", 404);
  }

  status.name = req.body.name ?? status.name;
  status.video_url = req.body.video_url ?? status.video_url;
  status.description = req.body.description ?? status.description;
  await status.save();
  res.status(200).json({
    status: true,
    data: status,
    message: "Status updated successfully",
  });
})

const deleteStatus = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const status = await Status.findOne({
    where: {
      id: req.params.id
    }
  });
  if (!status) {
    throw new AppError("Status not found", 404);
  }
  await status.remove();
  res.status(200).json({
    status: true,
    message: "Status deleted successfully",
  });
})

const getStatus = catchAsync(async (req: Request, res: Response) => {
  const status = await Status.find();
  res.status(200).json({
    status: true,
    data: status,
  });
})


export default {
  createStatus,
  updateStatus,
  deleteStatus,
  getStatus,
}
