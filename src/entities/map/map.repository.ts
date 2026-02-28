import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { maps, mapSvgMappings } from "@/entities/map/map.schema";
import type {
    CreateMap,
    CreateSvgMapping,
    FantasyMap as MapType,
    MapQueryParams,
    MapWithRelations,
    SvgMapping,
    UpdateMap,
} from "@/entities/map/map.types";
import { and, eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof maps> = {
    table: maps,
    searchColumns: [maps.name],
    sortableColumns: {
        id: maps.id,
        name: maps.name,
        universeId: maps.universeId,
        regionId: maps.regionId,
        createdAt: maps.createdAt,
        updatedAt: maps.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildWhereConditions(queryParams: MapQueryParams): SQL[] {
    const whereConditions: SQL[] = [];

    if ("name" in queryParams && typeof queryParams.name === "string") {
        whereConditions.push(eq(maps.name, queryParams.name));
    }

    if ("universeId" in queryParams && typeof queryParams.universeId === "string") {
        whereConditions.push(eq(maps.universeId, queryParams.universeId));
    }

    if ("regionId" in queryParams && typeof queryParams.regionId === "string") {
        whereConditions.push(eq(maps.regionId, queryParams.regionId));
    }

    return whereConditions;
}

export class MapRepository {
    async create(data: CreateMap): Promise<Result<MapType>> {
        try {
            const [result] = await db.insert(maps).values({
                ...data,
                imageUrl: data.imageUrl ?? "",
            }).returning();
            if (!result) {
                return {
                    success: false,
                    error: new DatabaseError("Failed to create map"),
                };
            }
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to create map", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdateMap): Promise<Result<MapType>> {
        try {
            const [result] = await db
                .update(maps)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(maps.id, id))
                .returning();

            if (!result) {
                return { success: false, error: new NotFoundError("Map", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to update map", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(maps)
                .where(eq(maps.id, id))
                .returning({ id: maps.id });

            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to delete map", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: MapQueryParams,
    ): Promise<Result<PaginatedResponse<MapType>>> {
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
                return await db.query.maps.findMany({
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<MapType>(
                configWithConditions,
                queryParams,
                queryBuilder,
            );
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find maps", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: MapQueryParams,
    ): Promise<Result<PaginatedResponse<MapWithRelations>>> {
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
                return await db.query.maps.findMany({
                    with: {
                        universe: true,
                        region: true,
                        svgMappings: true,
                    },
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<MapWithRelations>(
                configWithConditions,
                queryParams,
                queryBuilder,
            );
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find maps with relations", new Error(String(error))),
            };
        }
    }

    async findOne(id: string): Promise<Result<MapType>> {
        try {
            const result = await db.query.maps.findFirst({
                where: eq(maps.id, id),
            });

            if (!result) {
                return { success: false, error: new NotFoundError("Map", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find map", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<MapWithRelations>> {
        try {
            const result = await db.query.maps.findFirst({
                where: eq(maps.id, id),
                with: {
                    universe: true,
                    region: true,
                    svgMappings: true,
                },
            });

            if (!result) {
                return { success: false, error: new NotFoundError("Map", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find map with relations", new Error(String(error))),
            };
        }
    }

    // --- SVG Mapping Operations ---

    /**
     * Upserts an SVG mapping.
     * If a mapping for the same (mapId, svgElementId) already exists, it updates
     * the regionId and featureType. Otherwise, it inserts a new record.
     */
    async upsertSvgMapping(data: CreateSvgMapping): Promise<Result<SvgMapping>> {
        try {
            const [result] = await db
                .insert(mapSvgMappings)
                .values(data)
                .onConflictDoUpdate({
                    target: [mapSvgMappings.mapId, mapSvgMappings.svgElementId],
                    set: {
                        regionId: data.regionId,
                        featureType: data.featureType,
                        updatedAt: new Date(),
                    },
                })
                .returning();

            if (!result) {
                return { success: false, error: new DatabaseError("Failed to upsert svg mapping") };
            }
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to upsert svg mapping", new Error(String(error))),
            };
        }
    }

    async removeSvgMapping(mappingId: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(mapSvgMappings)
                .where(eq(mapSvgMappings.id, mappingId))
                .returning({ id: mapSvgMappings.id });

            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to delete map svg mapping", new Error(String(error))),
            };
        }
    }

    async removeSvgMappingByElementId(mapId: string, svgElementId: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(mapSvgMappings)
                .where(and(eq(mapSvgMappings.mapId, mapId), eq(mapSvgMappings.svgElementId, svgElementId)))
                .returning({ id: mapSvgMappings.id });

            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to delete svg mapping by element", new Error(String(error))),
            };
        }
    }

    async getSvgMappingsByMapId(mapId: string): Promise<Result<SvgMapping[]>> {
        try {
            const results = await db.query.mapSvgMappings.findMany({
                where: eq(mapSvgMappings.mapId, mapId),
            });
            return { success: true, data: results };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to fetch svg mappings", new Error(String(error))),
            };
        }
    }
}
