import AppError from '@/utils/AppError.js';
import multer from 'multer';
import path, { extname } from 'path';
import fs from 'fs';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 } from 'cloudinary';
import env from '@/utils/env.js';
import { v4 } from 'uuid';

v2.config({
  cloud_name: env.CLOUDNARY_CLOUD_NAME,
  api_key: env.CLOUDNARY_API_KEY,
  api_secret: env.CLOUDNARY_API_SECRET,
});

export const myCloudinary = v2;

export interface multerFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}
export type multerFiledType = { [fieldname: string]: multerFile[] };

const fileSize = 1024 * 1024 * 1; // 5MB
const videoSize = 1024 * 1024 * 10; // 10MB
const excelSize = 1024 * 1024 * 25; // 25MB

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const path = 'public/uploads/image/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true,
      });
    }
    cb(null, path);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname) + '-' + Date.now();
    cb(null, baseName + ext);
  },
});

const excelStorage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    const path = 'public/uploads/excel/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, {
        recursive: true,
      });
    }
    cb(null, path);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname) + '-' + Date.now();
    cb(null, baseName + ext);
  },
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    public_id: (req, file) => v4(),
    // resource_type: 'video,image',
  } as any,
});

export const uploadImage = multer({
  storage: storage,
  fileFilter: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    if (
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.gif' &&
      ext !== '.jpeg' &&
      ext !== '.webp'
    ) {
      return cb(
        new AppError('Only image files are allowed!', 300) as any,
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: fileSize,
  },
});

export const uploadVideo = multer({
  storage: cloudinaryStorage,
  fileFilter: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    if (
      ext !== '.mp4' &&
      ext !== '.avi' &&
      ext !== '.flv' &&
      ext !== '.wmv' &&
      ext !== '.mov' &&
      ext !== '.webm' &&
      ext !== '.png' &&
      ext !== '.jpg' &&
      ext !== '.gif' &&
      ext !== '.jpeg' &&
      ext !== '.webp'
    ) {
      return cb(
        new AppError('Only video and image files are allowed!', 300) as any,
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: videoSize,
  },
});

export const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: function (_req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.xlsx' && ext !== '.xls') {
      return cb(
        new AppError('Only excel files are allowed!', 300) as any,
        false,
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: excelSize,
  },
});
