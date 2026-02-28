import { asc, desc, type SQL, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import type { Result } from "@/common/common.types";
import { DatabaseError } from "@/common/error.types";
import type {
  PaginatedResponse,
  PaginationConfig,
  PaginationParams,
} from "@/common/pagination/pagination.types";
import { db } from "@/db/connection";

export async function paginate<TData>(
  config: PaginationConfig<PgTable>,
  params: PaginationParams,
  queryBuilder?: (options: {
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
    .select({ count: sql<number>`count(*)` })
    .from(config.table)
    .where(whereClause);

  const count = countResult[0]?.count ?? 0;

  // Get paginated data with sorting
  const sortColumn = config.sortableColumns[sortBy];
  if (!sortColumn) {
    return {
      success: false,
      error: new DatabaseError(`Invalid sort field: ${sortBy}`),
    };
  }

  const orderBy = sortOrder === "asc" ? asc(sortColumn) : desc(sortColumn);

  let data: TData[];
  if (queryBuilder) {
    data = await queryBuilder({ where: whereClause, orderBy, limit, offset: skip });
  } else {
    // We enforce that the DB layer returns structured data matches TData signature
    const result = await db
      .select()
      .from(config.table)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(skip);

    // Typecast handled by repository schema mapping upstream, generic here
    data = result;
  }

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
