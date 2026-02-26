import type { Column, SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';

export interface PaginationParams {
  limit?: number;
  page?: number;
  offset?: number | undefined;
  sortBy?: string | undefined;
  sortOrder?: 'asc' | 'desc';
  search?: string | undefined;
}

export interface PaginationConfig<T extends PgTable> {
  table: T;
  searchColumns?: Column[];
  sortableColumns: Record<string, Column>;
  defaultSortBy: string;
  whereConditions?: SQL<unknown>[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
