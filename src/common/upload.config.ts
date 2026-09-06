import { memoryStorage } from 'multer';
import type { Request } from 'express';

export const imageUploadOptions = {
  storage: memoryStorage(),
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
