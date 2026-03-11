import { promises as fs } from "node:fs";
import path from "node:path";

export interface IFileService {
  save(file: Express.Multer.File, directory: string): Promise<string>;
  delete(filePath: string): Promise<void>;
  getUrl(filePath: string): string;
  extractRelativePath(url: string): string | null;
  moveToTrash(url: string): Promise<void>;
}

export class LocalFileService implements IFileService {
  private uploadDir: string;
  private trashDir: string;
  private baseUrl: string;

  constructor() {
    this.uploadDir = path.resolve(process.cwd(), "uploads");
    this.trashDir = path.resolve(process.cwd(), "trash-images");
    this.baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

    // Ensure directories exist
    void this.ensureDir(this.uploadDir);
    void this.ensureDir(this.trashDir);
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
    directory = "general",
  ): Promise<string> {
    const targetDir = path.join(this.uploadDir, directory);
    await this.ensureDir(targetDir);

    const fileName = `${String(Date.now())}-${file.originalname.replace(/\s+/g, "-")}`;
    const filePath = path.join(targetDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    // Return the relative path for database storage
    return path.join(directory, fileName).replace(/\\/g, "/");
  }

  async delete(relativeFilePath: string): Promise<void> {
    const fullPath = path.join(this.uploadDir, relativeFilePath);
    await fs.unlink(fullPath);
  }

  getUrl(relativeFilePath: string): string {
    return `${this.baseUrl}/uploads/${relativeFilePath}`;
  }

  extractRelativePath(url: string): string | null {
    if (!url) return null;
    const parts = url.split("/uploads/");
    if (parts.length > 1 && parts[1]) {
      return parts[1];
    }
    return null;
  }

  async moveToTrash(url: string): Promise<void> {
    const relativePath = this.extractRelativePath(url);
    if (!relativePath) return;

    const sourcePath = path.join(this.uploadDir, relativePath);
    const fileName = path.basename(relativePath);
    const destPath = path.join(this.trashDir, fileName);

    try {
      await fs.access(sourcePath);
      await fs.rename(sourcePath, destPath);
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === "ENOENT") {
        return;
      }
      throw error;
    }
  }
}

export const fileService = new LocalFileService();
