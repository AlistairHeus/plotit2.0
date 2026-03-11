import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { ConstructRepository } from "@/entities/construct/construct.repository";
import type {
  CreateConstruct,
  Construct,
  ConstructQueryParams,
  UpdateConstruct,
} from "@/entities/construct/construct.types";
import type { IFileService } from "@/common/file/file.service";

export class ConstructService {
  private constructRepository: ConstructRepository;
  private fileService: IFileService;

  constructor(
    constructRepository: ConstructRepository,
    fileService: IFileService,
  ) {
    this.constructRepository = constructRepository;
    this.fileService = fileService;
  }

  async createConstruct(
    data: CreateConstruct,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Construct> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "construct",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "construct");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.constructRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getConstructs(
    queryParams: ConstructQueryParams,
  ): Promise<PaginatedResponse<Construct>> {
    const result = await this.constructRepository.findAll(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getConstructById(id: string): Promise<Construct | null> {
    const result = await this.constructRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateConstruct(
    id: string,
    data: UpdateConstruct,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Construct> {
    const existing = await this.constructRepository.findOneWithRelations(id);
    if (!existing.success) throw existing.error;
    const oldAvatarUrl = existing.data.avatarUrl;
    const oldImageUrls = existing.data.imageUrls;

    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "construct",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "construct");
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

    const result = await this.constructRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteConstruct(id: string): Promise<boolean> {
    const existing = await this.constructRepository.findOneWithRelations(id);
    if (existing.success) {
      if (existing.data.avatarUrl) {
        void this.fileService.moveToTrash(existing.data.avatarUrl);
      }
      existing.data.imageUrls.forEach((url: string) => void this.fileService.moveToTrash(url));
    }

    const result = await this.constructRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
