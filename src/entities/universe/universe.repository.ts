import { eq, type SQL } from "drizzle-orm";
import { BaseRepository } from "@/common/base.repository";
import type { Result } from "@/common/common.types";
import { DatabaseError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { universes } from "@/entities/universe/universe.schema";
import type { z } from "zod";
import type {
  CreateUniverse,
  Universe,
  UniverseQueryParams,
  UniverseWithRelations,
  UpdateUniverse,
} from "@/entities/universe/universe.types";
import { selectUniverseSchema } from "./universe.validation";

export class UniverseRepository extends BaseRepository<
  Universe,
  CreateUniverse,
  UniverseQueryParams
> {
  protected table = universes;
  protected selectSchema = selectUniverseSchema as unknown as z.ZodType<Universe>;

  protected paginationConfig: PaginationConfig<typeof universes> = {
    table: universes,
    searchColumns: [universes.name], // Add more searchable columns as needed
    sortableColumns: {
      id: universes.id,
      name: universes.name,
      createdAt: universes.createdAt,
      updatedAt: universes.updatedAt,
    },
    defaultSortBy: "createdAt",
  };

  protected buildWhereConditions(queryParams: UniverseQueryParams): SQL[] {
    const whereConditions: SQL[] = [];

    const filters = queryParams;

    if (filters.name) {
      whereConditions.push(eq(universes.name, filters.name));
    }

    // Add more filters as needed
    // if (filters.institutionId) {
    //   whereConditions.push(eq(universes.institutionId, filters.institutionId));
    // }

    return whereConditions;
  }

  async findAllWithRelations(
    queryParams: UniverseQueryParams,
  ): Promise<Result<PaginatedResponse<UniverseWithRelations>, DatabaseError>> {
    const dynamicConditions = this.buildWhereConditions(queryParams);

    const configWithConditions = {
      ...this.paginationConfig,
      whereConditions: [
        ...(this.paginationConfig.whereConditions ?? []),
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
      const results = await db.query.universes.findMany({
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

      return results;
    };

    return await paginate<UniverseWithRelations>(
      configWithConditions,
      queryParams,
      queryBuilder,
    );
  }

  async findOneWithRelations(
    id: string,
  ): Promise<Result<UniverseWithRelations, DatabaseError>> {
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
      return {
        success: false,
        error: new DatabaseError("Universe not found"),
      };
    }

    return {
      success: true,
      data: result,
    };
  }
}
