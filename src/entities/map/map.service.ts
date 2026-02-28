import type { IFileService } from "@/common/file/file.service";
import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { MapRepository } from "@/entities/map/map.repository";
import type {
    CreateMap,
    CreateSvgMapping,
    FantasyMap,
    GridCellData,
    GridSetupData,
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
        // 1. Save the file
        const relativePath = await this.fileService.save(file, "maps");
        const imageUrl = this.fileService.getUrl(relativePath);

        // 2. Create the map record
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
            // 1. Get existing map to delete old image
            const existingMapResult = await this.mapRepository.findOne(id);
            if (existingMapResult.success && existingMapResult.data.imageUrl) {
                try {
                    // Extract relative path from URL
                    const oldUrl = existingMapResult.data.imageUrl;
                    const relativePath = oldUrl.split("/uploads/")[1];
                    if (relativePath) {
                        await this.fileService.delete(relativePath);
                    }
                } catch (error) {
                    console.error("Failed to delete old map image:", error);
                }
            }

            // 2. Save new file
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
        // 1. Get existing map to delete image
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

        // 2. Delete record
        const result = await this.mapRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // Specialized methods

    async updateGridSettings(id: string, settings: GridSetupData): Promise<FantasyMap> {
        const result = await this.mapRepository.updateGridSettings(id, settings);
        if (!result.success) throw result.error;
        return result.data;
    }

    async updateCellData(
        id: string,
        rowColKey: string,
        cellData: GridCellData,
    ): Promise<FantasyMap> {
        const result = await this.mapRepository.updateCellData(id, rowColKey, cellData);
        if (!result.success) throw result.error;
        return result.data;
    }

    async createSvgMapping(data: CreateSvgMapping): Promise<SvgMapping> {
        const result = await this.mapRepository.createSvgMapping(data);
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
