import { BaseRepository } from "@/common/base.repository";
import { DatabaseError } from "@/common/error.types";
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
  UniverseWithRelations
} from "@/entities/universe/universe.types";
import { eq, type SQL } from "drizzle-orm";
import { selectUniverseSchema } from "./universe.validation";

export class UniverseRepository extends BaseRepository<
  Universe,
  CreateUniverse,
  UniverseQueryParams
> {
  protected table = universes;
  // selectUniverseSchema is a ZodObject narrower than ZodType<Universe>;
  // widen through unknown to satisfy the abstract base's { parse(data: unknown): TEntity } contract.
  protected selectSchema = selectUniverseSchema as unknown as { parse(data: unknown): Universe };

  protected paginationConfig: PaginationConfig<typeof universes> = {
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

  protected buildWhereConditions(queryParams: UniverseQueryParams): SQL[] {
    const whereConditions: SQL[] = [];

    if (typeof queryParams.name === "string") {
      whereConditions.push(eq(universes.name, queryParams.name));
    }

    return whereConditions;
  }

  async findAllWithRelations(
    queryParams: UniverseQueryParams,
  ): Promise<PaginatedResponse<UniverseWithRelations>> {
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

    const result = await paginate<UniverseWithRelations>(
      configWithConditions,
      queryParams,
      queryBuilder,
    );

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async findOneWithRelations(id: string): Promise<UniverseWithRelations> {
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
      throw new DatabaseError("Universe not found");
    }

    return result;
  }
}
