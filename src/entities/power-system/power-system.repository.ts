import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import {
    rootsOfPower,
    powerSystems,
    powerSubSystems,
    powerCategories,
    powerAbilities
} from "@/entities/power-system/power-system.schema";
import type {
    CreateRootOfPower,
    UpdateRootOfPower,
    RootOfPower,
    CreatePowerSystem,
    UpdatePowerSystem,
    PowerSystem,
    CreatePowerSubSystem,
    UpdatePowerSubSystem,
    PowerSubSystem,
    CreatePowerCategory,
    UpdatePowerCategory,
    PowerCategory,
    CreatePowerAbility,
    UpdatePowerAbility,
    PowerAbility,
    PowerSystemQueryParams,
    PowerSystemWithRelations,
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

    // --- rootsOfPower ---
    async createRoot(data: CreateRootOfPower): Promise<Result<RootOfPower>> {
        try {
            const [result] = await db.insert(rootsOfPower).values(data).returning();
            if (!result) return { success: false, error: new DatabaseError("Failed to create rootOfPower") };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to create rootOfPower", new Error(String(error))) };
        }
    }
    async updateRoot(id: string, data: UpdateRootOfPower): Promise<Result<RootOfPower>> {
        try {
            const [result] = await db.update(rootsOfPower).set({ ...data, updatedAt: new Date() }).where(eq(rootsOfPower.id, id)).returning();
            if (!result) return { success: false, error: new NotFoundError("RootOfPower", id) };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to update rootOfPower", new Error(String(error))) };
        }
    }
    async deleteRoot(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db.delete(rootsOfPower).where(eq(rootsOfPower.id, id)).returning({ id: rootsOfPower.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to delete rootOfPower", new Error(String(error))) };
        }
    }

    async createPowerSystem(data: CreatePowerSystem): Promise<Result<PowerSystem>> {
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

    async updatePowerSystem(id: string, data: UpdatePowerSystem): Promise<Result<PowerSystem>> {
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

    async deletePowerSystem(id: string): Promise<Result<boolean>> {
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

    async findAllPowerSystems(
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

    async findAllPowerSystemsWithRelations(
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

    async findOnePowerSystem(id: string): Promise<Result<PowerSystem>> {
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

    async findOnePowerSystemWithRelations(id: string): Promise<Result<PowerSystemWithRelations>> {
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

    // --- powerSubSystems ---
    async createSubSystem(data: CreatePowerSubSystem): Promise<Result<PowerSubSystem>> {
        try {
            const [result] = await db.insert(powerSubSystems).values(data).returning();
            if (!result) return { success: false, error: new DatabaseError("Failed to create powerSubSystem") };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to create powerSubSystem", new Error(String(error))) };
        }
    }
    async updateSubSystem(id: string, data: UpdatePowerSubSystem): Promise<Result<PowerSubSystem>> {
        try {
            const [result] = await db.update(powerSubSystems).set({ ...data, updatedAt: new Date() }).where(eq(powerSubSystems.id, id)).returning();
            if (!result) return { success: false, error: new NotFoundError("PowerSubSystem", id) };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to update powerSubSystem", new Error(String(error))) };
        }
    }
    async deleteSubSystem(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db.delete(powerSubSystems).where(eq(powerSubSystems.id, id)).returning({ id: powerSubSystems.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to delete powerSubSystem", new Error(String(error))) };
        }
    }

    // --- powerCategories ---
    async createCategory(data: CreatePowerCategory): Promise<Result<PowerCategory>> {
        try {
            const [result] = await db.insert(powerCategories).values(data).returning();
            if (!result) return { success: false, error: new DatabaseError("Failed to create powerCategory") };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to create powerCategory", new Error(String(error))) };
        }
    }
    async updateCategory(id: string, data: UpdatePowerCategory): Promise<Result<PowerCategory>> {
        try {
            const [result] = await db.update(powerCategories).set({ ...data, updatedAt: new Date() }).where(eq(powerCategories.id, id)).returning();
            if (!result) return { success: false, error: new NotFoundError("PowerCategory", id) };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to update powerCategory", new Error(String(error))) };
        }
    }
    async deleteCategory(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db.delete(powerCategories).where(eq(powerCategories.id, id)).returning({ id: powerCategories.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to delete powerCategory", new Error(String(error))) };
        }
    }

    // --- powerAbilities ---
    async createAbility(data: CreatePowerAbility): Promise<Result<PowerAbility>> {
        try {
            const [result] = await db.insert(powerAbilities).values(data).returning();
            if (!result) return { success: false, error: new DatabaseError("Failed to create powerAbility") };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to create powerAbility", new Error(String(error))) };
        }
    }
    async updateAbility(id: string, data: UpdatePowerAbility): Promise<Result<PowerAbility>> {
        try {
            const [result] = await db.update(powerAbilities).set({ ...data, updatedAt: new Date() }).where(eq(powerAbilities.id, id)).returning();
            if (!result) return { success: false, error: new NotFoundError("PowerAbility", id) };
            return { success: true, data: result };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to update powerAbility", new Error(String(error))) };
        }
    }
    async deleteAbility(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db.delete(powerAbilities).where(eq(powerAbilities.id, id)).returning({ id: powerAbilities.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to delete powerAbility", new Error(String(error))) };
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
