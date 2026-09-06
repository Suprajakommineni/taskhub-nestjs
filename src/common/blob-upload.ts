import { put } from '@vercel/blob';

export async function uploadToBlob(file: Express.Multer.File): Promise<string> {
  const blob = await put(
    `profile-photos/${Date.now()}-${file.originalname}`,
    file.buffer,
    { access: 'public', contentType: file.mimetype },
  );
  return blob.url;
}
