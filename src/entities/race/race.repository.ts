import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { races } from "@/entities/race/race.schema";
import type {
    CreateRace,
    Race,
    RaceQueryParams,
    RaceWithRelations,
    UpdateRace,
} from "@/entities/race/race.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof races> = {
    table: races,
    searchColumns: [races.name],
    sortableColumns: {
        id: races.id,
        name: races.name,
        createdAt: races.createdAt,
        updatedAt: races.updatedAt,
    },
    defaultSortBy: "createdAt",
};

function buildWhereConditions(queryParams: RaceQueryParams): SQL[] {
    const whereConditions: SQL[] = [];

    if ("name" in queryParams && typeof queryParams.name === "string") {
        whereConditions.push(eq(races.name, queryParams.name));
    }

    if ("universeId" in queryParams && typeof queryParams.universeId === "string") {
        whereConditions.push(eq(races.universeId, queryParams.universeId));
    }

    return whereConditions;
}

export class RaceRepository {
    async create(data: CreateRace): Promise<Result<Race>> {
        try {
            const [result] = await db.insert(races).values(data).returning();
            if (!result) {
                return {
                    success: false,
                    error: new DatabaseError("Failed to create race"),
                };
            }
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to create race", new Error(String(error))),
            };
        }
    }

    async update(id: string, data: UpdateRace): Promise<Result<Race>> {
        try {
            const [result] = await db
                .update(races)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(races.id, id))
                .returning();

            if (!result) {
                return { success: false, error: new NotFoundError("Race", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to update race", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db
                .delete(races)
                .where(eq(races.id, id))
                .returning({ id: races.id });

            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to delete race", new Error(String(error))),
            };
        }
    }

    async findAll(
        queryParams: RaceQueryParams,
    ): Promise<Result<PaginatedResponse<Race>>> {
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
                return await db.query.races.findMany({
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<Race>(
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
                        : new DatabaseError("Failed to find races", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(
        queryParams: RaceQueryParams,
    ): Promise<Result<PaginatedResponse<RaceWithRelations>>> {
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
                return await db.query.races.findMany({
                    with: {
                        universe: true,
                        ethnicGroups: true,
                    },
                    where,
                    orderBy: [orderBy],
                    limit,
                    offset,
                });
            };

            return await paginate<RaceWithRelations>(
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
                            "Failed to find races with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }

    async findOne(id: string): Promise<Result<Race>> {
        try {
            const result = await db.query.races.findFirst({
                where: eq(races.id, id),
            });

            if (!result) {
                return { success: false, error: new NotFoundError("Race", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError("Failed to find race", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<RaceWithRelations>> {
        try {
            const result = await db.query.races.findFirst({
                where: eq(races.id, id),
                with: {
                    universe: true,
                    ethnicGroups: true,
                },
            });

            if (!result) {
                return { success: false, error: new NotFoundError("Race", id) };
            }

            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error
                        : new DatabaseError(
                            "Failed to find race with relations",
                            new Error(String(error)),
                        ),
            };
        }
    }
}
