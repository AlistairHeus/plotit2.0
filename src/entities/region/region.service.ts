import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { RegionRepository } from "@/entities/region/region.repository";
import type {
  CreateRegion,
  Region,
  RegionQueryParams,
  UpdateRegion,
} from "@/entities/region/region.types";
import type { IFileService } from "@/common/file/file.service";

export class RegionService {
  private regionRepository: RegionRepository;
  private fileService: IFileService;

  constructor(regionRepository: RegionRepository, fileService: IFileService) {
    this.regionRepository = regionRepository;
    this.fileService = fileService;
  }

  async createRegion(
    data: CreateRegion,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Region> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "region",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "region");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.regionRepository.create(data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getRegions(
    queryParams: RegionQueryParams,
  ): Promise<PaginatedResponse<Region>> {
    const result = await this.regionRepository.findAll(queryParams);
    if (!result.success) throw result.error;
    return result.data;
  }

  async getRegionById(id: string): Promise<Region | null> {
    const result = await this.regionRepository.findOneWithRelations(id);
    if (!result.success) return null;
    return result.data;
  }

  async updateRegion(
    id: string,
    data: UpdateRegion,
    files?: Record<string, Express.Multer.File[]>,
  ): Promise<Region> {
    if (files) {
      if (files.avatar && files.avatar.length > 0 && files.avatar[0]) {
        const avatarPath = await this.fileService.save(
          files.avatar[0],
          "region",
        );
        data.avatarUrl = this.fileService.getUrl(avatarPath);
      }
      if (files.images && files.images.length > 0) {
        const imageUrls = await Promise.all(
          files.images.map(async (file) => {
            const savedPath = await this.fileService.save(file, "region");
            return this.fileService.getUrl(savedPath);
          }),
        );
        const currentImageUrls = Array.isArray(data.imageUrls)
          ? data.imageUrls
          : [];
        data.imageUrls = [...currentImageUrls, ...imageUrls];
      }
    }
    const result = await this.regionRepository.update(id, data);
    if (!result.success) throw result.error;
    return result.data;
  }

  async deleteRegion(id: string): Promise<boolean> {
    const result = await this.regionRepository.delete(id);
    if (!result.success) throw result.error;
    return result.data;
  }
}
