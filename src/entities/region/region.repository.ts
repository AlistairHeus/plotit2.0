import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { planets, religions } from "@/db/schema";
import { regions } from "@/entities/region/region.schema";
import type {
  CreateRegion,
  Region,
  RegionQueryParams,
  RegionWithRelations,
  RegionWithRelationsLean,
  UpdateRegion
} from "@/entities/region/region.types";
import { eq, ilike, inArray, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof regions> = {
  table: regions,
  searchColumns: [regions.name],
  sortableColumns: {
    id: regions.id,
    name: regions.name,
    type: regions.type,
    createdAt: regions.createdAt,
    updatedAt: regions.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: RegionQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  // 1. Fuzzy Name Search (The Region's own name)
  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(ilike(regions.name, `%${queryParams.name}%`));
  }

  // 2. Direct ID Filters (Original Logic - Essential for Frontend)
  if ("universeId" in queryParams && typeof queryParams.universeId === "string") {
    whereConditions.push(eq(regions.universeId, queryParams.universeId));
  }
  if ("planetId" in queryParams && typeof queryParams.planetId === "string") {
    whereConditions.push(eq(regions.planetId, queryParams.planetId));
  }
  if ("parentId" in queryParams && typeof queryParams.parentId === "string") {
    whereConditions.push(eq(regions.parentId, queryParams.parentId));
  }
  if ("religionId" in queryParams && typeof queryParams.religionId === "string") {
    whereConditions.push(eq(regions.religionId, queryParams.religionId));
  }

  // 3. Enum Type Guard
  if ("type" in queryParams && queryParams.type) {
    whereConditions.push(eq(regions.type, queryParams.type));
  }

  // 4. Smart Name Resolvers (New AI Logic - Subqueries)

  // Planet Name Search
  if ("planetName" in queryParams && typeof queryParams.planetName === "string") {
    const planetSubquery = db
      .select({ id: planets.id })
      .from(planets)
      .where(ilike(planets.name, `%${queryParams.planetName}%`));
    whereConditions.push(inArray(regions.planetId, planetSubquery));
  }

  // Religion Name Search
  if ("religionName" in queryParams && typeof queryParams.religionName === "string") {
    const religionSubquery = db
      .select({ id: religions.id })
      .from(religions)
      .where(ilike(religions.name, `%${queryParams.religionName}%`));
    whereConditions.push(inArray(regions.religionId, religionSubquery));
  }

  // Hierarchical Parent Name Search
  if ("parentName" in queryParams && typeof queryParams.parentName === "string") {
    const parentSubquery = db
      .select({ id: regions.id })
      .from(regions)
      .where(ilike(regions.name, `%${queryParams.parentName}%`));
    whereConditions.push(inArray(regions.parentId, parentSubquery));
  }

  return whereConditions;
}

export class RegionRepository {
  async create(data: CreateRegion): Promise<Result<Region>> {
    try {
      const [result] = await db.insert(regions).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create region"),
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
              "Failed to create region",
              new Error(String(error)),
            ),
      };
    }
  }

  async update(id: string, data: UpdateRegion): Promise<Result<Region>> {
    try {
      const [result] = await db
        .update(regions)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(regions.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("Region", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to update region",
              new Error(String(error)),
            ),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(regions)
        .where(eq(regions.id, id))
        .returning({ id: regions.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to delete region",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAll(
    queryParams: RegionQueryParams,
  ): Promise<Result<PaginatedResponse<Region>>> {
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
        return await db.query.regions.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<Region>(
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
              "Failed to find regions",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAllWithRelations(
    queryParams: RegionQueryParams,
  ): Promise<Result<PaginatedResponse<RegionWithRelations | RegionWithRelationsLean>>> {
    try {
      const isLean = "lean" in queryParams && queryParams.lean === true;
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
        if (isLean) {
          const results = await db.query.regions.findMany({
            columns: {
              id: true,
              name: true,
              type: true,
              description: true,
              avatarUrl: true,
            },
            with: {
              // 1. Fixed: Added description to match your Lean interface
              universe: { columns: { name: true, description: true } },
              planet: { columns: { name: true, description: true } },
              parent: { columns: { name: true, type: true } },
            },
            where,
            orderBy: [orderBy],
            limit,
            offset,
          });

          // 2. Cast to allow the Union type to be satisfied
          return results as RegionWithRelationsLean[];
        }

        const results = await db.query.regions.findMany({
          with: {
            universe: true,
            planet: true,
            religion: true,
            parent: true,
            subRegions: true,
            maps: true,
            svgMappings: {
              with: {
                map: true,
              },
            },
          },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });

        return results as RegionWithRelations[];
      };

      return await paginate(
        configWithConditions,
        queryParams,
        queryBuilder,
      );
    }
    catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find regions with relations",
              new Error(String(error)),
            ),

      };

    }
  }

  async findOne(id: string): Promise<Result<Region>> {
    try {
      const result = await db.query.regions.findFirst({
        where: eq(regions.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Region", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find region",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOneWithRelations(id: string): Promise<Result<RegionWithRelations>> {
    try {
      const result = await db.query.regions.findFirst({
        where: eq(regions.id, id),
        with: {
          universe: true,
          planet: true,
          religion: true,
          parent: true,
          subRegions: true,
          maps: true,
          svgMappings: {
            with: {
              map: true,
            },
          },
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Region", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find region with relations",
              new Error(String(error)),
            ),
      };
    }
  }
}
