import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { rootsOfPower, powerSystems } from "@/entities/power-system/power-system.schema";
import type {
    CreatePowerSystem,
    PowerSystem,
    PowerSystemQueryParams,
    PowerSystemWithRelations,
    UpdatePowerSystem,
} from "@/entities/power-system/power-system.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof powerSystems> = {
    table: powerSystems,
    searchColumns: [powerSystems.name],
    sortableColumns: {
        id: powerSystems.id,
        name: powerSystems.name,
        createdAt: powerSystems.createdAt,
        updatedAt: powerSystems.updatedAt,
    },
    defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: PowerSystemQueryParams): SQL[] {
    const whereConditions: SQL[] = [];

    if ("name" in queryParams && typeof queryParams.name === "string") {
        whereConditions.push(eq(powerSystems.name, queryParams.name));
    }

    if ("rootOfPowerId" in queryParams && typeof queryParams.rootOfPowerId === "string") {
        whereConditions.push(eq(powerSystems.rootOfPowerId, queryParams.rootOfPowerId));
    }

    return whereConditions;
}

export class PowerSystemRepository {
    async create(data: CreatePowerSystem): Promise<Result<PowerSystem>> {
        try {
            const [result] = await db.insert(powerSystems).values(data).returning();
            if (!result) {
                return {
                    success: false,
                    error: new DatabaseError("Failed to create power-system"),
                };
            }
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to create power-system", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdatePowerSystem): Promise<Result<PowerSystem>> {
        try {
            const [result] = await db
                .update(powerSystems)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(powerSystems.id, id))
                .returning();

            if (!result) {
                return { success: false, error: new NotFoundError("PowerSystem", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to update power-system", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(powerSystems)
                .where(eq(powerSystems.id, id))
                .returning({ id: powerSystems.id });

            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to delete power-system", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: PowerSystemQueryParams,
    ): Promise<Result<PaginatedResponse<PowerSystem>>> {
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
                return await db.query.powerSystems.findMany({
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<PowerSystem>(
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
                        : new DatabaseError("Failed to find power-systems", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: PowerSystemQueryParams,
    ): Promise<Result<PaginatedResponse<PowerSystemWithRelations>>> {
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
                return await db.query.powerSystems.findMany({
                    with: {
                        rootOfPower: {
                            with: {
                                universe: true
                            }
                        },
                        subSystems: true,
                        categories: true,
                        abilities: true,
                        characterAccess: true
                    },
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<PowerSystemWithRelations>(
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
                            "Failed to find power-systems with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<PowerSystem>> {
        try {
            const result = await db.query.powerSystems.findFirst({
                where: eq(powerSystems.id, id),
            });

            if (!result) {
                return { success: false, error: new NotFoundError("PowerSystem", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find power-system", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<PowerSystemWithRelations>> {
        try {
            const result = await db.query.powerSystems.findFirst({
                where: eq(powerSystems.id, id),
                with: {
                    rootOfPower: {
                        with: {
                            universe: true
                        }
                    },
                    subSystems: true,
                    categories: true,
                    abilities: true,
                    characterAccess: true
                },
            });

            if (!result) {
                return { success: false, error: new NotFoundError("PowerSystem", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find power-system with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
    async getGraphData(universeId: string) {
        try {
            const data = await db.query.rootsOfPower.findMany({
                where: eq(rootsOfPower.universeId, universeId),
                with: {
                    powerSystems: {
                        with: {
                            subSystems: {
                                with: {
                                    categories: {
                                        with: {
                                            abilities: true
                                        }
                                    },
                                    abilities: true,
                                }
                            },
                            categories: {
                                with: {
                                    abilities: true
                                }
                            },
                            abilities: true,
                        }
                    }
                }
            });

            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find graph data",
                            new Error(String(error)),
                        ),
            };
        }
    }
}
