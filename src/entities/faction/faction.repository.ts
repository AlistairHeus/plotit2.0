import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { factions } from "@/entities/faction/faction.schema";
import type {
  CreateFaction,
  Faction,
  FactionQueryParams,
  FactionWithRelations,
  UpdateFaction,
} from "@/entities/faction/faction.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof factions> = {
  table: factions,
  searchColumns: [factions.name],
  sortableColumns: {
    id: factions.id,
    name: factions.name,
    type: factions.type,
    createdAt: factions.createdAt,
    updatedAt: factions.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: FactionQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(eq(factions.name, queryParams.name));
  }

  if (
    "universeId" in queryParams &&
    typeof queryParams.universeId === "string"
  ) {
    whereConditions.push(eq(factions.universeId, queryParams.universeId));
  }

  if (
    "headquartersId" in queryParams &&
    typeof queryParams.headquartersId === "string"
  ) {
    whereConditions.push(
      eq(factions.headquartersId, queryParams.headquartersId),
    );
  }

  if ("parentId" in queryParams && typeof queryParams.parentId === "string") {
    whereConditions.push(eq(factions.parentId, queryParams.parentId));
  }

  if ("type" in queryParams && queryParams.type) {
    whereConditions.push(eq(factions.type, queryParams.type));
  }

  return whereConditions;
}
export class FactionRepository {
  async create(data: CreateFaction): Promise<Result<Faction>> {
    try {
      const [result] = await db.insert(factions).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create faction"),
        };
      }
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to create faction",
              new Error(String(error)),
            ),
      };
    }
  }

  async update(id: string, data: UpdateFaction): Promise<Result<Faction>> {
    try {
      const [result] = await db
        .update(factions)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(factions.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("Faction", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to update faction",
              new Error(String(error)),
            ),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(factions)
        .where(eq(factions.id, id))
        .returning({ id: factions.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to delete faction",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAll(
    queryParams: FactionQueryParams,
  ): Promise<Result<PaginatedResponse<Faction>>> {
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
        return await db.query.factions.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<Faction>(
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
              "Failed to find factions",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAllWithRelations(
    queryParams: FactionQueryParams,
  ): Promise<Result<PaginatedResponse<FactionWithRelations>>> {
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
        return await db.query.factions.findMany({
          with: {
            universe: true,
            headquarters: true,
            parent: true,
            subFactions: true,
            members: {
              with: {
                character: true,
              },
            },
          },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<FactionWithRelations>(
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
              "Failed to find factions with relations",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOne(id: string): Promise<Result<Faction>> {
    try {
      const result = await db.query.factions.findFirst({
        where: eq(factions.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Faction", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find faction",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOneWithRelations(
    id: string,
  ): Promise<Result<FactionWithRelations>> {
    try {
      const result = await db.query.factions.findFirst({
        where: eq(factions.id, id),
        with: {
          universe: true,
          headquarters: true,
          parent: true,
          subFactions: true,
          members: {
            with: {
              character: true,
            },
          },
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Faction", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find faction with relations",
              new Error(String(error)),
            ),
      };
    }
  }
}
