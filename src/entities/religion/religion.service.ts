import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { ReligionRepository } from "@/entities/religion/religion.repository";
import type {
  CreateReligion,
  Religion,
  ReligionQueryParams,
  UpdateReligion,
} from "@/entities/religion/religion.types";
import type { IFileService } from "@/common/file/file.service";

export class ReligionService {
  private religionRepository: ReligionRepository;
  private fileService: IFileService;

  constructor(
    religionRepository: ReligionRepository,
    fileService: IFileService,
  ) {
    this.religionRepository = religionRepository;
    this.fileService = fileService;
  }

  async createReligion(
    data: CreateReligion,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Religion> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "religion",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "religion");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.religionRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getReligions(
    queryParams: ReligionQueryParams,
  ): Promise<PaginatedResponse<Religion>> {
    const result = await this.religionRepository.findAll(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getReligionById(id: string): Promise<Religion | null> {
    const result = await this.religionRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateReligion(
    id: string,
    data: UpdateReligion,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Religion> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "religion",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "religion");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.religionRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteReligion(id: string): Promise<boolean> {
    const result = await this.religionRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
