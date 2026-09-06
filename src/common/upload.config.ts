import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.config';
import type { Request } from 'express';

export const imageUploadOptions = {
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'taskhub/profile-photos',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    },
  }),

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!/^image\/(jpe?g|png|gif|webp)$/.test(file.mimetype)) {
      cb(new Error('Only JPG, PNG, GIF, or WEBP images are allowed'), false);
      return;
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};
