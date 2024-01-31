import AppError from '@/utils/AppError.js';
import multer from 'multer';
import path from 'path';

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

const storage = multer.diskStorage({
  destination: function(_req, _file, cb) {
    cb(null, 'public/uploads/image/');
  },
  filename: function(_req, file, cb) {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname) + '-' + Date.now();
    cb(null, baseName + ext);
  },
});
export const uploadImage = multer({
  storage: storage,
  fileFilter: function(_req, file, cb) {
    const ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
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
