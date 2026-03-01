import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type {
    GalaxyRepository,
    SolarSystemRepository,
    StarRepository,
    PlanetRepository
} from "@/entities/celestial/celestial.repository";
import type {
    CreateGalaxy, Galaxy, GalaxyQueryParams, UpdateGalaxy,
    CreateSolarSystem, SolarSystem, SolarSystemQueryParams, UpdateSolarSystem,
    CreateStar, Star, StarQueryParams, UpdateStar,
    CreatePlanet, Planet, PlanetQueryParams, UpdatePlanet
} from "@/entities/celestial/celestial.types";
import { InvalidArgumentError } from "@/common/error.types";

export class CelestialService {
    constructor(
        private galaxyRepository: GalaxyRepository,
        private solarSystemRepository: SolarSystemRepository,
        private starRepository: StarRepository,
        private planetRepository: PlanetRepository
    ) { }

    // --- GALAXY ---
    async createGalaxy(data: CreateGalaxy): Promise<Galaxy> {
        const result = await this.galaxyRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getGalaxies(queryParams: GalaxyQueryParams): Promise<PaginatedResponse<Galaxy>> {
        const result = await this.galaxyRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getGalaxyById(id: string): Promise<Galaxy | null> {
        const result = await this.galaxyRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updateGalaxy(id: string, data: UpdateGalaxy): Promise<Galaxy> {
        const result = await this.galaxyRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteGalaxy(id: string): Promise<boolean> {
        const result = await this.galaxyRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- SOLAR SYSTEM ---
    async createSolarSystem(data: CreateSolarSystem): Promise<SolarSystem> {
        const result = await this.solarSystemRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getSolarSystems(queryParams: SolarSystemQueryParams): Promise<PaginatedResponse<SolarSystem>> {
        const result = await this.solarSystemRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getSolarSystemById(id: string): Promise<SolarSystem | null> {
        const result = await this.solarSystemRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updateSolarSystem(id: string, data: UpdateSolarSystem): Promise<SolarSystem> {
        const result = await this.solarSystemRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteSolarSystem(id: string): Promise<boolean> {
        const result = await this.solarSystemRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- STAR ---
    async createStar(data: CreateStar): Promise<Star> {
        const result = await this.starRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getStars(queryParams: StarQueryParams): Promise<PaginatedResponse<Star>> {
        const result = await this.starRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getStarById(id: string): Promise<Star | null> {
        const result = await this.starRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updateStar(id: string, data: UpdateStar): Promise<Star> {
        const result = await this.starRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deleteStar(id: string): Promise<boolean> {
        const result = await this.starRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }

    // --- PLANET ---
    async createPlanet(data: CreatePlanet): Promise<Planet> {
        if (data.parentPlanetId) {
            const parentResult = await this.planetRepository.findOne(data.parentPlanetId);
            if (parentResult.success) {
                if (parentResult.data.systemId !== data.systemId) {
                    throw new InvalidArgumentError("Moon's systemId must match parent planet's systemId");
                }
            }
        }

        const result = await this.planetRepository.create(data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getPlanets(queryParams: PlanetQueryParams): Promise<PaginatedResponse<Planet>> {
        const result = await this.planetRepository.findAll(queryParams);
        if (!result.success) throw result.error;
        return result.data;
    }

    async getPlanetById(id: string): Promise<Planet | null> {
        const result = await this.planetRepository.findOneWithRelations(id);
        if (!result.success) return null;
        return result.data;
    }

    async updatePlanet(id: string, data: UpdatePlanet): Promise<Planet> {
        if (data.parentPlanetId) {
            const planetResult = await this.planetRepository.findOne(id);
            if (planetResult.success) {
                const parentResult = await this.planetRepository.findOne(data.parentPlanetId);
                if (parentResult.success) {
                    const systemId = 'systemId' in data && data.systemId ? data.systemId : planetResult.data.systemId;
                    if (parentResult.data.systemId !== systemId) {
                        throw new InvalidArgumentError("Moon's systemId must match parent planet's systemId");
                    }
                }
            }
        }

        const result = await this.planetRepository.update(id, data);
        if (!result.success) throw result.error;
        return result.data;
    }

    async deletePlanet(id: string): Promise<boolean> {
        const result = await this.planetRepository.delete(id);
        if (!result.success) throw result.error;
        return result.data;
    }
}
