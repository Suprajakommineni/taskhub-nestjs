import { join, isAbsolute } from 'path';

export function resolveUploadsDir(): string {
  if (process.env.VERCEL) {
    return '/tmp/uploads';
  }

  const configured = process.env.UPLOADS_DIR || './uploads';

  return isAbsolute(configured)
    ? configured
    : join(__dirname, '..', '..', configured);
}
