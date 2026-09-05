import { diskStorage } from 'multer';
import { extname } from 'path';
import { resolveUploadsDir } from './uploads-dir';
import type { Request } from 'express';

export const imageUploadOptions = {
  storage: diskStorage({
    destination: resolveUploadsDir(),
    filename: (
      _req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${extname(file.originalname)}`);
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
