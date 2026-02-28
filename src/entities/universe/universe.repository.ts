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

  return whereConditions;
}

export class UniverseRepository {
  async create(data: CreateUniverse): Promise<Universe> {
    const [result] = await db.insert(universes).values(data).returning();
    if (!result) {
      throw new DatabaseError("Failed to create universe");
    }
    return result;
  }

  async update(id: string, data: UpdateUniverse): Promise<Universe> {
    const [result] = await db
      .update(universes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(universes.id, id))
      .returning();

    if (!result) {
      throw new NotFoundError("Universe", id);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await db
      .delete(universes)
      .where(eq(universes.id, id))
      .returning({ id: universes.id });

    return result !== undefined;
  }

  async findAllWithRelations(
    queryParams: UniverseQueryParams,
  ): Promise<PaginatedResponse<UniverseWithRelations>> {
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

  async findOne(id: string): Promise<Universe> {
    const result = await db.query.universes.findFirst({
      where: eq(universes.id, id),
    });

    if (!result) {
      throw new NotFoundError("Universe", id);
    }

    return result;
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
      throw new NotFoundError("Universe", id);
    }

    return result;
  }
}
