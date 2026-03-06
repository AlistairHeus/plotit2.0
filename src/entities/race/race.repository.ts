import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
    PaginatedResponse,
    PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { ethnicGroups, races } from "@/entities/race/race.schema";
import type {
    CreateEthnicGroup,
    CreateRace,
    EthnicGroup,
    Race,
    RaceQueryParams,
    RaceWithRelations,
    UpdateEthnicGroup,
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
    // --- Race Methods ---

    async create(data: CreateRace): Promise<Result<Race>> {
        try {
            const [result] = await db.insert(races).values(data).returning();
            if (!result) {
                return { success: false, error: new DatabaseError("Failed to create race") };
            }
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to create race", new Error(String(error))),
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

            if (!result) return { success: false, error: new NotFoundError("Race", id) };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to update race", new Error(String(error))),
            };
        }
    }

    async delete(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db.delete(races).where(eq(races.id, id)).returning({ id: races.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to delete race", new Error(String(error))),
            };
        }
    }

    async findAll(queryParams: RaceQueryParams): Promise<Result<PaginatedResponse<Race>>> {
        try {
            const configWithConditions = {
                ...paginationConfig,
                whereConditions: [
                    ...(paginationConfig.whereConditions ?? []),
                    ...buildWhereConditions(queryParams),
                ],
            };

            const queryBuilder = async ({ where, orderBy, limit, offset }: { where: SQL | undefined; orderBy: SQL; limit: number; offset: number }) =>
                db.query.races.findMany({ where, orderBy: [orderBy], limit, offset });

            return await paginate<Race>(configWithConditions, queryParams, queryBuilder);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find races", new Error(String(error))),
            };
        }
    }

    async findAllWithRelations(queryParams: RaceQueryParams): Promise<Result<PaginatedResponse<RaceWithRelations>>> {
        try {
            const configWithConditions = {
                ...paginationConfig,
                whereConditions: [
                    ...(paginationConfig.whereConditions ?? []),
                    ...buildWhereConditions(queryParams),
                ],
            };

            const queryBuilder = async ({ where, orderBy, limit, offset }: { where: SQL | undefined; orderBy: SQL; limit: number; offset: number }) =>
                db.query.races.findMany({ with: { universe: true, ethnicGroups: true }, where, orderBy: [orderBy], limit, offset });

            return await paginate<RaceWithRelations>(configWithConditions, queryParams, queryBuilder);
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find races with relations", new Error(String(error))),
            };
        }
    }

    async findOne(id: string): Promise<Result<Race>> {
        try {
            const result = await db.query.races.findFirst({ where: eq(races.id, id) });
            if (!result) return { success: false, error: new NotFoundError("Race", id) };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find race", new Error(String(error))),
            };
        }
    }

    async findOneWithRelations(id: string): Promise<Result<RaceWithRelations>> {
        try {
            const result = await db.query.races.findFirst({
                where: eq(races.id, id),
                with: { universe: true, ethnicGroups: true },
            });
            if (!result) return { success: false, error: new NotFoundError("Race", id) };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find race with relations", new Error(String(error))),
            };
        }
    }

    // --- Ethnic Group Methods ---

    async createEthnicGroup(data: CreateEthnicGroup): Promise<Result<EthnicGroup>> {
        try {
            const [result] = await db.insert(ethnicGroups).values(data).returning();
            if (!result) return { success: false, error: new DatabaseError("Failed to create ethnic group") };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to create ethnic group", new Error(String(error))),
            };
        }
    }

    async updateEthnicGroup(id: string, data: UpdateEthnicGroup): Promise<Result<EthnicGroup>> {
        try {
            const [result] = await db
                .update(ethnicGroups)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(ethnicGroups.id, id))
                .returning();

            if (!result) return { success: false, error: new NotFoundError("EthnicGroup", id) };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to update ethnic group", new Error(String(error))),
            };
        }
    }

    async deleteEthnicGroup(id: string): Promise<Result<boolean>> {
        try {
            const [result] = await db.delete(ethnicGroups).where(eq(ethnicGroups.id, id)).returning({ id: ethnicGroups.id });
            return { success: true, data: result !== undefined };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to delete ethnic group", new Error(String(error))),
            };
        }
    }

    async findEthnicGroupsByRaceId(raceId: string): Promise<Result<EthnicGroup[]>> {
        try {
            const results = await db.query.ethnicGroups.findMany({
                where: eq(ethnicGroups.raceId, raceId),
            });
            return { success: true, data: results };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find ethnic groups", new Error(String(error))),
            };
        }
    }

    async findOneEthnicGroup(id: string): Promise<Result<EthnicGroup>> {
        try {
            const result = await db.query.ethnicGroups.findFirst({ where: eq(ethnicGroups.id, id) });
            if (!result) return { success: false, error: new NotFoundError("EthnicGroup", id) };
            return { success: true, data: result };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error : new DatabaseError("Failed to find ethnic group", new Error(String(error))),
            };
        }
    }
}
