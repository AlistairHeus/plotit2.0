import type { Result } from "@/common/common.types";
import { DatabaseError } from "@/common/error.types";
import type {
  PaginatedResponse,
  PaginationConfig,
  PaginationParams,
} from "@/common/pagination/pagination.types";
import { db } from "@/db/connection";
import { asc, desc, type SQL, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

export async function paginate<TData>(
  config: PaginationConfig<PgTable>,
  params: PaginationParams,
  queryBuilder: (options: {
    where: SQL | undefined;
    orderBy: SQL;
    limit: number;
    offset: number;
  }) => Promise<TData[]>,
): Promise<Result<PaginatedResponse<TData>, DatabaseError>> {
  const {
    limit = 20,
    page = 1,
    offset,
    sortBy = config.defaultSortBy,
    sortOrder = "desc",
    search,
  } = params;

  const skip = offset ?? (page - 1) * limit;

  // Build where conditions
  const whereConditions: SQL[] = [...(config.whereConditions ?? [])];

  // Add search condition if provided
  if (search && config.searchColumns?.length) {
    const searchConditions = config.searchColumns.map(
      (column) => sql`${column} ILIKE ${`%${search}%`}`,
    );
    whereConditions.push(sql`(${sql.join(searchConditions, sql` OR `)})`);
  }

  const whereClause =
    whereConditions.length > 0
      ? sql.join(whereConditions, sql` AND `)
      : undefined;

  // Get total count
  const countResult = await db
    .select({ count: sql<number | string>`count(*)` })
    .from(config.table)
    .where(whereClause);

  const count = Number(countResult[0]?.count ?? 0);

  // Get paginated data with sorting
  const sortColumn = config.sortableColumns[sortBy];
  if (!sortColumn) {
    return {
      success: false,
      error: new DatabaseError(`Invalid sort field: ${sortBy}`),
    };
  }

  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);


  const data = await queryBuilder({
    where: whereClause,
    orderBy,
    limit,
    offset: skip
  });

  const totalPages = Math.ceil(count / limit);

  return {
    success: true,
    data: {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: count,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
}
