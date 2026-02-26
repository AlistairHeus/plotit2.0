import { promises as fs } from 'node:fs';
import path from 'node:path';
import log from '@/utils/logger';

export interface IFileService {
  save(file: Express.Multer.File, directory: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
}

export class LocalFileService implements IFileService {
  private uploadDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), 'uploads');
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';

    // Ensure upload directory exists
    this.ensureDir(this.uploadDir);
  }

  private async ensureDir(dir: string) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }

  async save(
    file: Express.Multer.File,
    directory = 'general'
  ): Promise<string> {
    const targetDir = path.join(this.uploadDir, directory);
    await this.ensureDir(targetDir);

    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(targetDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    // Return the relative path for database storage
    return path.join(directory, fileName).replace(/\\/g, '/');
  }

  async delete(relativeFilePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, relativeFilePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      log.error(`Failed to delete file at ${fullPath}:`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  getUrl(relativeFilePath: string): string {
    return `${this.baseUrl}/uploads/${relativeFilePath}`;
  }
}

export const fileService = new LocalFileService();
