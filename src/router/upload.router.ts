import imageController from '@/controller/image.controller.js';
import {
  uploadImage,
  uploadVideo,
} from '@/middleware/uploadFile.middleware.js';
import { Router } from 'express';

const uploadRouter = Router();

uploadRouter.post(
  '/image',
  uploadImage.single('image'),
  imageController.uploadImge,
);
uploadRouter.post(
  '/video',
  uploadVideo.single('video'),
  imageController.uploadVideo,
);

export default uploadRouter;
