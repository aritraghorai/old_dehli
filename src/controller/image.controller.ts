import { Video } from '@/entities/video.entity.js';
import { myCloudinary } from '@/middleware/uploadFile.middleware.js';
import { ImageRepository } from '@/orm/datasources/index.js';
import AppError from '@/utils/AppError.js';
import catchAsync from '@/utils/catchAsync.js';
import env from '@/utils/env.js';
import { NextFunction, Request, Response } from 'express';
import fs from 'fs/promises';
import { log } from 'util';

const uploadImge = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as Express.Multer.File;
    console.log(file);

    const image = ImageRepository.create({
      path: file.path,
      filename: file.filename,
      url: `${env.BACKEND_URL}/${file.path}`,
    });
    await ImageRepository.save(image);

    res.status(200).json({
      status: true,
      message: 'Upload image successfully!',
      data: image,
    });
  },
);

const uploadVideo = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file as Express.Multer.File;
    const video = Video.create({
      url: file.path,
      filename: file.filename,
      path: file.path,
    });

    await video.save();

    res.status(200).json({
      status: true,
      message: 'Upload image successfully!',
      data: video,
    });
  },
);

const deleteVideo = async (videoUrl: string) => {
  const video = await Video.findOne({
    where: { url: videoUrl },
    select: {
      filename: true,
    },
  });
  if (!video) {
    return;
  }
  console.log(video);
  await myCloudinary.uploader.destroy(video.filename);
  await Video.delete({
    id: video.id,
  });
};

const deleteImage = async (imageId: string) => {
  const image = await ImageRepository.findOne({
    where: { id: imageId },
    select: ['id', 'path', 'url'],
  });
  if (!image) {
    throw new AppError('Image not found', 404);
  }
  console.log(image);
  if (image.url.includes(env.BACKEND_URL)) {
    console.log('delete image', image.path);
    await fs.unlink(image.path);
  }
  await ImageRepository.remove(image);
};
export default {
  uploadImge,
  deleteImage,
  uploadVideo,
  deleteVideo,
};
