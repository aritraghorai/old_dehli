import { ImageRepository } from "@/orm/datasources/index.js";
import catchAsync from "@/utils/catchAsync.js";
import env from "@/utils/env.js";
import { NextFunction, Request, Response } from "express";

const uploadImge = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file as Express.Multer.File
  console.log(file)

  const image = ImageRepository.create({
    path: file.path,
    filename: file.filename,
    url: `${env.BACKEND_URL}/${file.path}`
  })
  await ImageRepository.save(image)

  res.status(200).json({
    status: true,
    message: 'Upload image successfully!',
    data: image
  })
})

export default {
  uploadImge
}
