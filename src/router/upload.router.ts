import imageController from '@/controller/image.controller.js';
import { uploadImage } from '@/middleware/uploadFile.middleware.js';
import { Router } from 'express';

const uploadRouter = Router();

uploadRouter.post('/image', uploadImage.single('image'), imageController.uploadImge);

export default uploadRouter;
