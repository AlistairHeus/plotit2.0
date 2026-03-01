import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import {
    galaxies,
    solarSystems,
    stars,
    planets,
} from "@/entities/celestial/celestial.schema";
import type {
    Galaxy,
    CreateGalaxy,
    UpdateGalaxy,
    GalaxyQueryParams,
    GalaxyWithRelations,
    SolarSystem,
    CreateSolarSystem,
    UpdateSolarSystem,
    SolarSystemQueryParams,
    SolarSystemWithRelations,
    Star,
    CreateStar,
    UpdateStar,
    StarQueryParams,
    StarWithRelations,
    Planet,
    CreatePlanet,
    UpdatePlanet,
    PlanetQueryParams,
    PlanetWithRelations,
} from "@/entities/celestial/celestial.types";
import { eq, type SQL } from "drizzle-orm";

// --- GALAXY REPOSITORY ---

const galaxyPaginationConfig: PaginationConfig<typeof galaxies> = {
    table: galaxies,
    searchColumns: [galaxies.name],
    sortableColumns: {
        id: galaxies.id,
        name: galaxies.name,
        type: galaxies.type,
        createdAt: galaxies.createdAt,
        updatedAt: galaxies.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildGalaxyWhereConditions(queryParams: GalaxyQueryParams): SQL[] {
    const whereConditions: SQL[] = [];
    if (queryParams.name) whereConditions.push(eq(galaxies.name, queryParams.name));
    if (queryParams.universeId)
        whereConditions.push(eq(galaxies.universeId, queryParams.universeId));
    if (queryParams.type)
        whereConditions.push(eq(galaxies.type, queryParams.type));
    return whereConditions;
}

export class GalaxyRepository {
    async create(data: CreateGalaxy): Promise<Result<Galaxy>> {
        try {
            const [result] = await db.insert(galaxies).values(data).returning();
            if (!result)
                return {
                    success: false,
                    error: new DatabaseError("Failed to create galaxy"),
                };
            return { success: true, data: result as Galaxy };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to create galaxy", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdateGalaxy): Promise<Result<Galaxy>> {
        try {
            const [result] = await db
                .update(galaxies)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(galaxies.id, id))
                .returning();
            if (!result) return { success: false, error: new NotFoundError("Galaxy", id) };
            return { success: true, data: result as Galaxy };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to update galaxy", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(galaxies)
                .where(eq(galaxies.id, id))
                .returning({ id: galaxies.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to delete galaxy", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: GalaxyQueryParams,
    ): Promise<Result<PaginatedResponse<Galaxy>>> {
        try {
            const whereConditions = buildGalaxyWhereConditions(queryParams);
            const config = { ...galaxyPaginationConfig, whereConditions };

            return await paginate<Galaxy>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.galaxies.findMany({
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find galaxies", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: GalaxyQueryParams,
    ): Promise<Result<PaginatedResponse<GalaxyWithRelations>>> {
        try {
            const whereConditions = buildGalaxyWhereConditions(queryParams);
            const config = { ...galaxyPaginationConfig, whereConditions };

            return await paginate<GalaxyWithRelations>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.galaxies.findMany({
                        with: {
                            universe: true,
                            solarSystems: true,
                        },
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find galaxies with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<Galaxy>> {
        try {
            const result = await db.query.galaxies.findFirst({
                where: eq(galaxies.id, id),
            });
            if (!result) return { success: false, error: new NotFoundError("Galaxy", id) };
            return { success: true, data: result as Galaxy };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find galaxy", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<GalaxyWithRelations>> {
        try {
            const result = await db.query.galaxies.findFirst({
                where: eq(galaxies.id, id),
                with: {
                    universe: true,
                    solarSystems: true,
                },
            });
            if (!result) return { success: false, error: new NotFoundError("Galaxy", id) };
            return { success: true, data: result as GalaxyWithRelations };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find galaxy with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
}

// --- SOLAR SYSTEM REPOSITORY ---

const solarSystemPaginationConfig: PaginationConfig<typeof solarSystems> = {
    table: solarSystems,
    searchColumns: [solarSystems.name],
    sortableColumns: {
        id: solarSystems.id,
        name: solarSystems.name,
        createdAt: solarSystems.createdAt,
        updatedAt: solarSystems.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildSolarSystemWhereConditions(queryParams: SolarSystemQueryParams): SQL[] {
    const whereConditions: SQL[] = [];
    if (queryParams.name)
        whereConditions.push(eq(solarSystems.name, queryParams.name));
    if (queryParams.galaxyId)
        whereConditions.push(eq(solarSystems.galaxyId, queryParams.galaxyId));
    return whereConditions;
}

export class SolarSystemRepository {
    async create(data: CreateSolarSystem): Promise<Result<SolarSystem>> {
        try {
            const [result] = await db.insert(solarSystems).values(data).returning();
            if (!result)
                return {
                    success: false,
                    error: new DatabaseError("Failed to create solar system"),
                };
            return { success: true, data: result as SolarSystem };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to create solar system",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async update(id: string, data: UpdateSolarSystem): Promise<Result<SolarSystem>> {
        try {
            const [result] = await db
                .update(solarSystems)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(solarSystems.id, id))
                .returning();
            if (!result)
                return { success: false, error: new NotFoundError("Solar System", id) };
            return { success: true, data: result as SolarSystem };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to update solar system",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(solarSystems)
                .where(eq(solarSystems.id, id))
                .returning({ id: solarSystems.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to delete solar system",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findAll(
        queryParams: SolarSystemQueryParams,
    ): Promise<Result<PaginatedResponse<SolarSystem>>> {
        try {
            const whereConditions = buildSolarSystemWhereConditions(queryParams);
            const config = { ...solarSystemPaginationConfig, whereConditions };

            return await paginate<SolarSystem>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.solarSystems.findMany({
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find solar systems",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findAllWithRelations(
        queryParams: SolarSystemQueryParams,
    ): Promise<Result<PaginatedResponse<SolarSystemWithRelations>>> {
        try {
            const whereConditions = buildSolarSystemWhereConditions(queryParams);
            const config = { ...solarSystemPaginationConfig, whereConditions };

            return await paginate<SolarSystemWithRelations>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.solarSystems.findMany({
                        with: {
                            galaxy: true,
                            stars: true,
                            planets: true,
                        },
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find solar systems with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<SolarSystem>> {
        try {
            const result = await db.query.solarSystems.findFirst({
                where: eq(solarSystems.id, id),
            });
            if (!result)
                return { success: false, error: new NotFoundError("Solar System", id) };
            return { success: true, data: result as SolarSystem };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find solar system",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOneWithRelations(
        id: string,
    ): Promise<Result<SolarSystemWithRelations>> {
        try {
            const result = await db.query.solarSystems.findFirst({
                where: eq(solarSystems.id, id),
                with: {
                    galaxy: true,
                    stars: true,
                    planets: true,
                },
            });
            if (!result)
                return { success: false, error: new NotFoundError("Solar System", id) };
            return { success: true, data: result as SolarSystemWithRelations };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find solar system with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
}

// --- STAR REPOSITORY ---

const starPaginationConfig: PaginationConfig<typeof stars> = {
    table: stars,
    searchColumns: [stars.name],
    sortableColumns: {
        id: stars.id,
        name: stars.name,
        type: stars.type,
        createdAt: stars.createdAt,
        updatedAt: stars.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildStarWhereConditions(queryParams: StarQueryParams): SQL[] {
    const whereConditions: SQL[] = [];
    if (queryParams.name) whereConditions.push(eq(stars.name, queryParams.name));
    if (queryParams.systemId)
        whereConditions.push(eq(stars.systemId, queryParams.systemId));
    if (queryParams.type) whereConditions.push(eq(stars.type, queryParams.type));
    return whereConditions;
}

export class StarRepository {
    async create(data: CreateStar): Promise<Result<Star>> {
        try {
            const [result] = await db.insert(stars).values(data).returning();
            if (!result)
                return {
                    success: false,
                    error: new DatabaseError("Failed to create star"),
                };
            return { success: true, data: result as Star };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to create star", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdateStar): Promise<Result<Star>> {
        try {
            const [result] = await db
                .update(stars)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(stars.id, id))
                .returning();
            if (!result) return { success: false, error: new NotFoundError("Star", id) };
            return { success: true, data: result as Star };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to update star", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(stars)
                .where(eq(stars.id, id))
                .returning({ id: stars.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to delete star", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: StarQueryParams,
    ): Promise<Result<PaginatedResponse<Star>>> {
        try {
            const whereConditions = buildStarWhereConditions(queryParams);
            const config = { ...starPaginationConfig, whereConditions };

            return await paginate<Star>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.stars.findMany({
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find stars", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: StarQueryParams,
    ): Promise<Result<PaginatedResponse<StarWithRelations>>> {
        try {
            const whereConditions = buildStarWhereConditions(queryParams);
            const config = { ...starPaginationConfig, whereConditions };

            return await paginate<StarWithRelations>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.stars.findMany({
                        with: {
                            solarSystem: true,
                        },
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find stars with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<Star>> {
        try {
            const result = await db.query.stars.findFirst({
                where: eq(stars.id, id),
            });
            if (!result) return { success: false, error: new NotFoundError("Star", id) };
            return { success: true, data: result as Star };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find star", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<StarWithRelations>> {
        try {
            const result = await db.query.stars.findFirst({
                where: eq(stars.id, id),
                with: {
                    solarSystem: true,
                },
            });
            if (!result) return { success: false, error: new NotFoundError("Star", id) };
            return { success: true, data: result as StarWithRelations };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find star with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
}

// --- PLANET REPOSITORY ---

const planetPaginationConfig: PaginationConfig<typeof planets> = {
    table: planets,
    searchColumns: [planets.name],
    sortableColumns: {
        id: planets.id,
        name: planets.name,
        isHabitable: planets.isHabitable,
        createdAt: planets.createdAt,
        updatedAt: planets.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildPlanetWhereConditions(queryParams: PlanetQueryParams): SQL[] {
    const whereConditions: SQL[] = [];
    if (queryParams.name) whereConditions.push(eq(planets.name, queryParams.name));
    if (queryParams.systemId)
        whereConditions.push(eq(planets.systemId, queryParams.systemId));
    if (queryParams.parentPlanetId)
        whereConditions.push(eq(planets.parentPlanetId, queryParams.parentPlanetId));
    if (queryParams.isHabitable !== undefined)
        whereConditions.push(eq(planets.isHabitable, queryParams.isHabitable));
    return whereConditions;
}

export class PlanetRepository {
    async create(data: CreatePlanet): Promise<Result<Planet>> {
        try {
            const [result] = await db.insert(planets).values(data).returning();
            if (!result)
                return {
                    success: false,
                    error: new DatabaseError("Failed to create planet"),
                };
            return { success: true, data: result as Planet };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to create planet", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdatePlanet): Promise<Result<Planet>> {
        try {
            const [result] = await db
                .update(planets)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(planets.id, id))
                .returning();
            if (!result) return { success: false, error: new NotFoundError("Planet", id) };
            return { success: true, data: result as Planet };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to update planet", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(planets)
                .where(eq(planets.id, id))
                .returning({ id: planets.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to delete planet", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: PlanetQueryParams,
    ): Promise<Result<PaginatedResponse<Planet>>> {
        try {
            const whereConditions = buildPlanetWhereConditions(queryParams);
            const config = { ...planetPaginationConfig, whereConditions };

            return await paginate<Planet>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.planets.findMany({
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find planets", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: PlanetQueryParams,
    ): Promise<Result<PaginatedResponse<PlanetWithRelations>>> {
        try {
            const whereConditions = buildPlanetWhereConditions(queryParams);
            const config = { ...planetPaginationConfig, whereConditions };

            return await paginate<PlanetWithRelations>(
                config,
                queryParams,
                async ({ where, orderBy, limit, offset }) => {
                    return await db.query.planets.findMany({
                        with: {
                            solarSystem: true,
                            parentPlanet: true,
                            moons: true,
                            regions: true,
                        },
                        where,
                        orderBy: [orderBy],
                        limit,
                        offset,
                    });
                },
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find planets with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<Planet>> {
        try {
            const result = await db.query.planets.findFirst({
                where: eq(planets.id, id),
            });
            if (!result) return { success: false, error: new NotFoundError("Planet", id) };
            return { success: true, data: result as Planet };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find planet", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<PlanetWithRelations>> {
        try {
            const result = (await db.query.planets.findFirst({
                where: eq(planets.id, id),
                with: {
                    solarSystem: true,
                    parentPlanet: true,
                    moons: true,
                    regions: true,
                },
            })) as PlanetWithRelations | undefined;
            if (!result) return { success: false, error: new NotFoundError("Planet", id) };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find planet with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
}
