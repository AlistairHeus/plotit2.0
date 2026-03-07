import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { religions } from "@/entities/religion/religion.schema";
import type {
  CreateReligion,
  Religion,
  ReligionQueryParams,
  ReligionWithRelations,
  UpdateReligion,
} from "@/entities/religion/religion.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof religions> = {
  table: religions,
  searchColumns: [religions.name],
  sortableColumns: {
    id: religions.id,
    name: religions.name,
    createdAt: religions.createdAt,
    updatedAt: religions.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: ReligionQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(eq(religions.name, queryParams.name));
  }

  if (
    "universeId" in queryParams &&
    typeof queryParams.universeId === "string"
  ) {
    whereConditions.push(eq(religions.universeId, queryParams.universeId));
  }

  return whereConditions;
}

export class ReligionRepository {
  async create(data: CreateReligion): Promise<Result<Religion>> {
    try {
      const [result] = await db.insert(religions).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create religion"),
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
                "Failed to create religion",
                new Error(String(error)),
              ),
      };
    }
  }

  async update(id: string, data: UpdateReligion): Promise<Result<Religion>> {
    try {
      const [result] = await db
        .update(religions)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(religions.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("Religion", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to update religion",
                new Error(String(error)),
              ),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(religions)
        .where(eq(religions.id, id))
        .returning({ id: religions.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to delete religion",
                new Error(String(error)),
              ),
      };
    }
  }

  async findAll(
    queryParams: ReligionQueryParams,
  ): Promise<Result<PaginatedResponse<Religion>>> {
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
        return await db.query.religions.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<Religion>(
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
                "Failed to find religions",
                new Error(String(error)),
              ),
      };
    }
  }

  async findAllWithRelations(
    queryParams: ReligionQueryParams,
  ): Promise<Result<PaginatedResponse<ReligionWithRelations>>> {
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
        return await db.query.religions.findMany({
          with: {
            universe: true,
            regions: true,
          },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<ReligionWithRelations>(
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
                "Failed to find religions with relations",
                new Error(String(error)),
              ),
      };
    }
  }

  async findOne(id: string): Promise<Result<Religion>> {
    try {
      const result = await db.query.religions.findFirst({
        where: eq(religions.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Religion", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to find religion",
                new Error(String(error)),
              ),
      };
    }
  }

  async findOneWithRelations(
    id: string,
  ): Promise<Result<ReligionWithRelations>> {
    try {
      const result = await db.query.religions.findFirst({
        where: eq(religions.id, id),
        with: {
          universe: true,
          regions: true,
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Religion", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
                "Failed to find religion with relations",
                new Error(String(error)),
              ),
      };
    }
  }
}
