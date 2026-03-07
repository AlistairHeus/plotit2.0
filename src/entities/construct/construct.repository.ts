import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { constructs } from "@/entities/construct/construct.schema";
import {
  CreateConstruct,
  Construct,
  ConstructQueryParams,
  ConstructWithRelations,
  UpdateConstruct,
  ConstructCategory,
} from "@/entities/construct/construct.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof constructs> = {
  table: constructs,
  searchColumns: [constructs.name],
  sortableColumns: {
    id: constructs.id,
    name: constructs.name,
    category: constructs.category,
    createdAt: constructs.createdAt,
    updatedAt: constructs.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: ConstructQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(eq(constructs.name, queryParams.name));
  }

  if (
    "universeId" in queryParams &&
    typeof queryParams.universeId === "string"
  ) {
    whereConditions.push(eq(constructs.universeId, queryParams.universeId));
  }

  if ("category" in queryParams && queryParams.category) {
    whereConditions.push(
      eq(constructs.category, queryParams.category as ConstructCategory),
    );
  }

  if ("rarity" in queryParams && typeof queryParams.rarity === "string") {
    whereConditions.push(eq(constructs.rarity, queryParams.rarity));
  }

  return whereConditions;
}

export class ConstructRepository {
  async create(data: CreateConstruct): Promise<Result<Construct>> {
    try {
      const [result] = await db.insert(constructs).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create construct"),
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
                "Failed to create construct",
                new Error(String(error)),
              ),
      };
    }
  }

  async update(id: string, data: UpdateConstruct): Promise<Result<Construct>> {
    try {
      const [result] = await db
        .update(constructs)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(constructs.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("Construct", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to update construct",
                new Error(String(error)),
              ),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(constructs)
        .where(eq(constructs.id, id))
        .returning({ id: constructs.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to delete construct",
                new Error(String(error)),
              ),
      };
    }
  }

  async findAll(
    queryParams: ConstructQueryParams,
  ): Promise<Result<PaginatedResponse<Construct>>> {
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
        return await db.query.constructs.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<Construct>(
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
                "Failed to find constructs",
                new Error(String(error)),
              ),
      };
    }
  }

  async findAllWithRelations(
    queryParams: ConstructQueryParams,
  ): Promise<Result<PaginatedResponse<ConstructWithRelations>>> {
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
        return await db.query.constructs.findMany({
          with: {
            universe: true,
          },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<ConstructWithRelations>(
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
                "Failed to find constructs with relations",
                new Error(String(error)),
              ),
      };
    }
  }

  async findOne(id: string): Promise<Result<Construct>> {
    try {
      const result = await db.query.constructs.findFirst({
        where: eq(constructs.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Construct", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to find construct",
                new Error(String(error)),
              ),
      };
    }
  }

  async findOneWithRelations(
    id: string,
  ): Promise<Result<ConstructWithRelations>> {
    try {
      const result = await db.query.constructs.findFirst({
        where: eq(constructs.id, id),
        with: {
          universe: true,
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Construct", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to find construct with relations",
                new Error(String(error)),
              ),
      };
    }
  }
}
