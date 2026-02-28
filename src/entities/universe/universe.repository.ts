import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { universes } from "@/entities/universe/universe.schema";
import type {
  CreateUniverse,
  Universe,
  UniverseQueryParams,
  UniverseWithRelations,
  UpdateUniverse,
} from "@/entities/universe/universe.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof universes> = {
  table: universes,
  searchColumns: [universes.name],
  sortableColumns: {
    id: universes.id,
    name: universes.name,
    createdAt: universes.createdAt,
    updatedAt: universes.updatedAt,
  },
  defaultSortBy: "createdAt",
};

function buildWhereConditions(queryParams: UniverseQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(eq(universes.name, queryParams.name));
  }

  if ("userId" in queryParams && typeof queryParams.userId === "string") {
    whereConditions.push(eq(universes.userId, queryParams.userId));
  }

  return whereConditions;
}

export class UniverseRepository {
  async create(data: CreateUniverse): Promise<Result<Universe>> {
    try {
      const [result] = await db.insert(universes).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create universe"),
        };
      }
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to create universe", new Error(String(error))),
      };
    }
  }

  async update(id: string, data: UpdateUniverse): Promise<Result<Universe>> {
    try {
      const [result] = await db
        .update(universes)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(universes.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("Universe", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to update universe", new Error(String(error))),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(universes)
        .where(eq(universes.id, id))
        .returning({ id: universes.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to delete universe", new Error(String(error))),
      };
    }
  }

  async findAll(
    queryParams: UniverseQueryParams,
  ): Promise<Result<PaginatedResponse<Universe>>> {
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
        return await db.query.universes.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<Universe>(
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
            : new DatabaseError("Failed to find universes", new Error(String(error))),
      };
    }
  }

  async findAllWithRelations(
    queryParams: UniverseQueryParams,
  ): Promise<Result<PaginatedResponse<UniverseWithRelations>>> {
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
        return await db.query.universes.findMany({
          with: {
            characters: {
              with: {
                race: true,
                ethnicGroup: true,
              },
            },
            regions: true,
            maps: true,
            races: true,
          },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<UniverseWithRelations>(
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
              "Failed to find universes with relations",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOne(id: string): Promise<Result<Universe>> {
    try {
      const result = await db.query.universes.findFirst({
        where: eq(universes.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Universe", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to find universe", new Error(String(error))),
      };
    }
  }

  async findOneWithRelations(id: string): Promise<Result<UniverseWithRelations>> {
    try {
      const result = await db.query.universes.findFirst({
        where: eq(universes.id, id),
        with: {
          characters: {
            with: {
              race: true,
              ethnicGroup: true,
            },
          },
          regions: true,
          maps: true,
          races: true,
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Universe", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find universe with relations",
              new Error(String(error)),
            ),
      };
    }
  }
}
