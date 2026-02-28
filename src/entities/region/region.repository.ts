import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { regions } from "@/entities/region/region.schema";
import type {
    CreateRegion,
    Region,
    RegionQueryParams,
    RegionWithRelations,
    UpdateRegion,
} from "@/entities/region/region.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof regions> = {
    table: regions,
    searchColumns: [regions.name],
    sortableColumns: {
        id: regions.id,
        name: regions.name,
        type: regions.type,
        area: regions.area,
        population: regions.population,
        elevation: regions.elevation,
        createdAt: regions.createdAt,
        updatedAt: regions.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildWhereConditions(queryParams: RegionQueryParams): SQL[] {
    const whereConditions: SQL[] = [];

    if ("name" in queryParams && typeof queryParams.name === "string") {
        whereConditions.push(eq(regions.name, queryParams.name));
    }

    if ("universeId" in queryParams && typeof queryParams.universeId === "string") {
        whereConditions.push(eq(regions.universeId, queryParams.universeId));
    }

    if ("planetId" in queryParams && typeof queryParams.planetId === "string") {
        whereConditions.push(eq(regions.planetId, queryParams.planetId));
    }

    if ("parentId" in queryParams && typeof queryParams.parentId === "string") {
        whereConditions.push(eq(regions.parentId, queryParams.parentId));
    }

    if ("type" in queryParams && queryParams.type) {
        whereConditions.push(eq(regions.type, queryParams.type));
    }

    if ("climate" in queryParams && queryParams.climate) {
        whereConditions.push(eq(regions.climate, queryParams.climate));
    }

    return whereConditions;
}

export class RegionRepository {
    async create(data: CreateRegion): Promise<Result<Region>> {
        try {
            const [result] = await db.insert(regions).values(data).returning();
            if (!result) {
                return {
                    success: false,
                    error: new DatabaseError("Failed to create region"),
                };
            }
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to create region", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdateRegion): Promise<Result<Region>> {
        try {
            const [result] = await db
                .update(regions)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(regions.id, id))
                .returning();

            if (!result) {
                return { success: false, error: new NotFoundError("Region", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to update region", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(regions)
                .where(eq(regions.id, id))
                .returning({ id: regions.id });

            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to delete region", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: RegionQueryParams,
    ): Promise<Result<PaginatedResponse<Region>>> {
        try {
            const dynamicConditions = buildWhereConditions(queryParams);

            const configWithConditions = {
                ...paginationConfig,
                whereConditions: [
                    ...(paginationConfig.whereConditions ?? []),
                    ...dynamicConditions,
                ],
            };

            const queryBuilder = async ({
                where,
                orderBy,
                limit,
                offset,
            }: {
                where: SQL | undefined;
                orderBy: SQL;
                limit: number;
                offset: number;
            }) => {
                return await db.query.regions.findMany({
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<Region>(
                configWithConditions,
                queryParams,
                queryBuilder,
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find regions", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: RegionQueryParams,
    ): Promise<Result<PaginatedResponse<RegionWithRelations>>> {
        try {
            const dynamicConditions = buildWhereConditions(queryParams);

            const configWithConditions = {
                ...paginationConfig,
                whereConditions: [
                    ...(paginationConfig.whereConditions ?? []),
                    ...dynamicConditions,
                ],
            };

            const queryBuilder = async ({
                where,
                orderBy,
                limit,
                offset,
            }: {
                where: SQL | undefined;
                orderBy: SQL;
                limit: number;
                offset: number;
            }) => {
                return await db.query.regions.findMany({
                    with: {
                        universe: true,
                        planet: true,
                        religion: true,
                        parent: true,
                        subRegions: true,
                    },
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<RegionWithRelations>(
                configWithConditions,
                queryParams,
                queryBuilder,
            );
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find regions with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<Region>> {
        try {
            const result = await db.query.regions.findFirst({
                where: eq(regions.id, id),
            });

            if (!result) {
                return { success: false, error: new NotFoundError("Region", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find region", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<RegionWithRelations>> {
        try {
            const result = await db.query.regions.findFirst({
                where: eq(regions.id, id),
                with: {
                    universe: true,
                    planet: true,
                    religion: true,
                    parent: true,
                    subRegions: true,
                },
            });

            if (!result) {
                return { success: false, error: new NotFoundError("Region", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find region with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
}
