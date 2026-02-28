import type { IFileService } from "@/common/file/file.service";
import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { MapRepository } from "@/entities/map/map.repository";
import type {
    CreateMap,
    CreateSvgMapping,
    FantasyMap,
    MapQueryParams,
    MapWithRelations,
    SvgMapping,
    UpdateMap,
} from "@/entities/map/map.types";

export class MapService {
    private mapRepository: MapRepository;
    private fileService: IFileService;

    constructor(mapRepository: MapRepository, fileService: IFileService) {
        this.mapRepository = mapRepository;
        this.fileService = fileService;
    }

    async createMap(data: CreateMap, file: Express.Multer.File): Promise<FantasyMap> {
        const relativePath = await this.fileService.save(file, "maps");
        const imageUrl = this.fileService.getUrl(relativePath);

        const result = await this.mapRepository.create({
            ...data,
            imageUrl,
        });

        if (!result.success) throw result.error;
        return result.data;
    }

    async getMaps(queryParams: MapQueryParams): Promise<PaginatedResponse<FantasyMap>> {
        const result = await this.mapRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getMapsWithRelations(
        queryParams: MapQueryParams,
    ): Promise<PaginatedResponse<MapWithRelations>> {
        const result = await this.mapRepository.findAllWithRelations(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getMapById(id: string): Promise<FantasyMap> {
        const result = await this.mapRepository.findOne(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getMapByIdWithRelations(id: string): Promise<MapWithRelations> {
        const result = await this.mapRepository.findOneWithRelations(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    async updateMap(
        id: string,
        data: UpdateMap,
        file?: Express.Multer.File,
    ): Promise<FantasyMap> {
        let imageUrl = data.imageUrl;

        if (file) {
            const existingMapResult = await this.mapRepository.findOne(id);
            if (existingMapResult.success && existingMapResult.data.imageUrl) {
                try {
                    const oldUrl = existingMapResult.data.imageUrl;
                    const relativePath = oldUrl.split("/uploads/")[1];
                    if (relativePath) {
                        await this.fileService.delete(relativePath);
                    }
                } catch (error) {
                    console.error("Failed to delete old map image:", error);
                }
            }

            const newRelativePath = await this.fileService.save(file, "maps");
            imageUrl = this.fileService.getUrl(newRelativePath);
        }

        const result = await this.mapRepository.update(id, {
            ...data,
            imageUrl,
        });

        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteMap(id: string): Promise<boolean> {
        const existingMapResult = await this.mapRepository.findOne(id);
        if (existingMapResult.success && existingMapResult.data.imageUrl) {
            try {
                const oldUrl = existingMapResult.data.imageUrl;
                const relativePath = oldUrl.split("/uploads/")[1];
                if (relativePath) {
                    await this.fileService.delete(relativePath);
                }
            } catch (error) {
                console.error("Failed to delete map image during map deletion:", error);
            }
        }

        const result = await this.mapRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // SVG Mapping operations

    async upsertSvgMapping(data: CreateSvgMapping): Promise<SvgMapping> {
        const result = await this.mapRepository.upsertSvgMapping(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async removeSvgMapping(mappingId: string): Promise<boolean> {
        const result = await this.mapRepository.removeSvgMapping(mappingId);
        if (!result.success) throw result.error;
        return result.data;
    }

    async removeSvgMappingByElementId(mapId: string, svgElementId: string): Promise<boolean> {
        const result = await this.mapRepository.removeSvgMappingByElementId(mapId, svgElementId);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getSvgMappings(mapId: string): Promise<SvgMapping[]> {
        const result = await this.mapRepository.getSvgMappingsByMapId(mapId);
        if (!result.success) throw result.error;
        return result.data;
    }
}
