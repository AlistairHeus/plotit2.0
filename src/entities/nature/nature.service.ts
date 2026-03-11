import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { NatureRepository } from "@/entities/nature/nature.repository";
import type {
  CreateNature,
  Nature,
  NatureQueryParams,
  UpdateNature,
} from "@/entities/nature/nature.types";
import type { IFileService } from "@/common/file/file.service";

export class NatureService {
  private natureRepository: NatureRepository;
  private fileService: IFileService;

  constructor(
    natureRepository: NatureRepository,
    fileService: IFileService,
  ) {
    this.natureRepository = natureRepository;
    this.fileService = fileService;
  }

  async createNature(
    data: CreateNature,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Nature> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "nature",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "nature");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.natureRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getNatures(
    queryParams: NatureQueryParams,
  ): Promise<PaginatedResponse<Nature>> {
    const result = await this.natureRepository.findAll(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getNatureById(id: string): Promise<Nature | null> {
    const result = await this.natureRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateNature(
    id: string,
    data: UpdateNature,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Nature> {
    const existing = await this.natureRepository.findOneWithRelations(id);
    if (!existing.success) throw existing.error;
    const oldAvatarUrl = existing.data.avatarUrl;
    const oldImageUrls = existing.data.imageUrls;

    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "nature",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "nature");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }

    if (data.avatarUrl !== undefined && data.avatarUrl !== oldAvatarUrl) {
      if (oldAvatarUrl) void this.fileService.moveToTrash(oldAvatarUrl);
    }
    if (data.imageUrls !== undefined) {
      const newImageUrls = data.imageUrls;
      const removedImages = oldImageUrls.filter((url: string) => !newImageUrls.includes(url));
      removedImages.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.natureRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteNature(id: string): Promise<boolean> {
    const existing = await this.natureRepository.findOneWithRelations(id);
    if (existing.success) {
      if (existing.data.avatarUrl) {
        void this.fileService.moveToTrash(existing.data.avatarUrl);
      }
      existing.data.imageUrls.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.natureRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
