import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { CelestialService } from "@/entities/celestial/celestial.service";
import {
    createGalaxySchema, galaxyQuerySchema, updateGalaxySchema,
    createSolarSystemSchema, solarSystemQuerySchema, updateSolarSystemSchema,
    createStarSchema, starQuerySchema, updateStarSchema,
    createPlanetSchema, planetQuerySchema, updatePlanetSchema
} from "@/entities/celestial/celestial.validation";
import { validateBody, validateParams, validateQuery } from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class CelestialController {
    constructor(private celestialService: CelestialService) { }

    // --- GALAXY ---

    async createGalaxy(req: Request, res: Response): Promise<void> {
        const data = validateBody(req.body, createGalaxySchema);
        const result = await this.celestialService.createGalaxy(data);
        log.info("Galaxy created successfully", { id: result.id, operation: "create_galaxy" });
        res.status(201).json({ success: true, data: result, message: "Galaxy created successfully" });
    }

    async getGalaxies(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, galaxyQuerySchema);
        const result = await this.celestialService.getGalaxies(queryParams);
        log.info("Galaxies retrieved successfully", { count: result.data.length, operation: "get_galaxies" });
        res.status(200).json({ success: true, data: result.data, pagination: result.pagination, message: "Galaxies retrieved successfully" });
    }

    async getGalaxyById(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const result = await this.celestialService.getGalaxyById(id);
        if (!result) throw new NotFoundError("Galaxy", id);
        res.status(200).json({ success: true, data: result, message: "Galaxy retrieved successfully" });
    }

    async updateGalaxy(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const data = validateBody(req.body, updateGalaxySchema);
        const result = await this.celestialService.updateGalaxy(id, data);
        log.info("Galaxy updated successfully", { id: result.id, operation: "update_galaxy" });
        res.status(200).json({ success: true, data: result, message: "Galaxy updated successfully" });
    }

    async deleteGalaxy(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        await this.celestialService.deleteGalaxy(id);
        log.info("Galaxy deleted successfully", { operation: "delete_galaxy" });
        res.status(200).json({ success: true, message: "Galaxy deleted successfully" });
    }

    // --- SOLAR SYSTEM ---

    async createSolarSystem(req: Request, res: Response): Promise<void> {
        const data = validateBody(req.body, createSolarSystemSchema);
        const result = await this.celestialService.createSolarSystem(data);
        log.info("Solar System created successfully", { id: result.id, operation: "create_solar_system" });
        res.status(201).json({ success: true, data: result, message: "Solar System created successfully" });
    }

    async getSolarSystems(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, solarSystemQuerySchema);
        const result = await this.celestialService.getSolarSystems(queryParams);
        log.info("Solar Systems retrieved successfully", { count: result.data.length, operation: "get_solar_systems" });
        res.status(200).json({ success: true, data: result.data, pagination: result.pagination, message: "Solar Systems retrieved successfully" });
    }

    async getSolarSystemById(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const result = await this.celestialService.getSolarSystemById(id);
        if (!result) throw new NotFoundError("Solar System", id);
        res.status(200).json({ success: true, data: result, message: "Solar System retrieved successfully" });
    }

    async updateSolarSystem(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const data = validateBody(req.body, updateSolarSystemSchema);
        const result = await this.celestialService.updateSolarSystem(id, data);
        log.info("Solar System updated successfully", { id: result.id, operation: "update_solar_system" });
        res.status(200).json({ success: true, data: result, message: "Solar System updated successfully" });
    }

    async deleteSolarSystem(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        await this.celestialService.deleteSolarSystem(id);
        log.info("Solar System deleted successfully", { operation: "delete_solar_system" });
        res.status(200).json({ success: true, message: "Solar System deleted successfully" });
    }

    // --- STAR ---

    async createStar(req: Request, res: Response): Promise<void> {
        const data = validateBody(req.body, createStarSchema);
        const result = await this.celestialService.createStar(data);
        log.info("Star created successfully", { id: result.id, operation: "create_star" });
        res.status(201).json({ success: true, data: result, message: "Star created successfully" });
    }

    async getStars(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, starQuerySchema);
        const result = await this.celestialService.getStars(queryParams);
        log.info("Stars retrieved successfully", { count: result.data.length, operation: "get_stars" });
        res.status(200).json({ success: true, data: result.data, pagination: result.pagination, message: "Stars retrieved successfully" });
    }

    async getStarById(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const result = await this.celestialService.getStarById(id);
        if (!result) throw new NotFoundError("Star", id);
        res.status(200).json({ success: true, data: result, message: "Star retrieved successfully" });
    }

    async updateStar(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const data = validateBody(req.body, updateStarSchema);
        const result = await this.celestialService.updateStar(id, data);
        log.info("Star updated successfully", { id: result.id, operation: "update_star" });
        res.status(200).json({ success: true, data: result, message: "Star updated successfully" });
    }

    async deleteStar(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        await this.celestialService.deleteStar(id);
        log.info("Star deleted successfully", { operation: "delete_star" });
        res.status(200).json({ success: true, message: "Star deleted successfully" });
    }

    // --- PLANET ---

    async createPlanet(req: Request, res: Response): Promise<void> {
        const data = validateBody(req.body, createPlanetSchema);
        const result = await this.celestialService.createPlanet(data);
        log.info("Planet created successfully", { id: result.id, operation: "create_planet" });
        res.status(201).json({ success: true, data: result, message: "Planet created successfully" });
    }

    async getPlanets(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, planetQuerySchema);
        const result = await this.celestialService.getPlanets(queryParams);
        log.info("Planets retrieved successfully", { count: result.data.length, operation: "get_planets" });
        res.status(200).json({ success: true, data: result.data, pagination: result.pagination, message: "Planets retrieved successfully" });
    }

    async getPlanetById(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const result = await this.celestialService.getPlanetById(id);
        if (!result) throw new NotFoundError("Planet", id);
        res.status(200).json({ success: true, data: result, message: "Planet retrieved successfully" });
    }

    async updatePlanet(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        const data = validateBody(req.body, updatePlanetSchema);
        const result = await this.celestialService.updatePlanet(id, data);
        log.info("Planet updated successfully", { id: result.id, operation: "update_planet" });
        res.status(200).json({ success: true, data: result, message: "Planet updated successfully" });
    }

    async deletePlanet(req: Request, res: Response): Promise<void> {
        const id = validateParams(req.params.id, paramsSchema);
        await this.celestialService.deletePlanet(id);
        log.info("Planet deleted successfully", { operation: "delete_planet" });
        res.status(200).json({ success: true, message: "Planet deleted successfully" });
    }

}
