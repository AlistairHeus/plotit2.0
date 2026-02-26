import { BadRequestError } from '@/common/error.types';

export class ImageProcessor {
  /**
   * Validates if the file is an image and meets requirements.
   */
  validate(file: Express.Multer.File): void {
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
    ];

    if (!allowedImageTypes.includes(file.mimetype)) {
      throw new BadRequestError(
        `Invalid image type: ${file.mimetype}. Allowed: ${allowedImageTypes.join(', ')}`
      );
    }

    // Basic size check (though multer handles this, we can do extra here)
    if (file.size > 5 * 1024 * 1024) {
      throw new BadRequestError('Image size exceeds 5MB limit');
    }
  }
}

export const imageProcessor = new ImageProcessor();
