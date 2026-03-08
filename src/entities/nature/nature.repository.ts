import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { nature } from "@/entities/nature/nature.schema";
import {
  CreateNature,
  Nature,
  NatureQueryParams,
  NatureWithRelations,
  UpdateNature,
  NatureType,
} from "@/entities/nature/nature.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof nature> = {
  table: nature,
  searchColumns: [nature.name],
  sortableColumns: {
    id: nature.id,
    name: nature.name,
    type: nature.type,
    createdAt: nature.createdAt,
    updatedAt: nature.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: NatureQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(eq(nature.name, queryParams.name));
  }

  if (
    "universeId" in queryParams &&
    typeof queryParams.universeId === "string"
  ) {
    whereConditions.push(eq(nature.universeId, queryParams.universeId));
  }

  if ("type" in queryParams && queryParams.type) {
    whereConditions.push(
      eq(nature.type, queryParams.type as NatureType),
    );
  }

  return whereConditions;
}

export class NatureRepository {
  async create(data: CreateNature): Promise<Result<Nature>> {
    try {
      const [result] = await db.insert(nature).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create nature"),
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
              "Failed to create nature",
              new Error(String(error)),
            ),
      };
    }
  }

  async update(id: string, data: UpdateNature): Promise<Result<Nature>> {
    try {
      const [result] = await db
        .update(nature)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(nature.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("Nature", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to update nature",
              new Error(String(error)),
            ),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(nature)
        .where(eq(nature.id, id))
        .returning({ id: nature.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to delete nature",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAll(
    queryParams: NatureQueryParams,
  ): Promise<Result<PaginatedResponse<Nature>>> {
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
        return await db.query.nature.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<Nature>(
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
              "Failed to find natures",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAllWithRelations(
    queryParams: NatureQueryParams,
  ): Promise<Result<PaginatedResponse<NatureWithRelations>>> {
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
        return await db.query.nature.findMany({
          with: {
            universe: true,
          },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<NatureWithRelations>(
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
              "Failed to find natures with relations",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOne(id: string): Promise<Result<Nature>> {
    try {
      const result = await db.query.nature.findFirst({
        where: eq(nature.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Nature", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find nature",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOneWithRelations(
    id: string,
  ): Promise<Result<NatureWithRelations>> {
    try {
      const result = await db.query.nature.findFirst({
        where: eq(nature.id, id),
        with: {
          universe: true,
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Nature", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find nature with relations",
              new Error(String(error)),
            ),
      };
    }
  }
}
