import { eq, inArray, type SQL } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import type { Result } from '@/common/common.types';
import { DatabaseError } from '@/common/error.types';
import { paginate } from '@/common/pagination/pagination.service';
import type {
  PaginatedResponse,
  PaginationConfig,
  PaginationParams,
} from '@/common/pagination/pagination.types';
import { db } from '@/db/connection';

export abstract class BaseRepository<
  TEntity,
  TNewEntity extends Record<string, unknown>,
  TUpdateEntity extends Record<string, unknown>,
  TQueryParams extends PaginationParams,
> {
  protected abstract table: PgTable;
  protected abstract paginationConfig: PaginationConfig<PgTable>;

  protected abstract buildWhereConditions(
    queryParams: TQueryParams
  ): SQL<unknown>[];

  async create(data: TNewEntity): Promise<Result<TEntity, DatabaseError>> {
    const result = await db
      .insert(this.table)
      .values(data as Record<string, unknown>)
      .returning();
    const entity = result[0];

    if (!entity) {
      return {
        success: false,
        error: new DatabaseError('Failed to create entity - no data returned'),
      };
    }

    return {
      success: true,
      data: entity as TEntity,
    };
  }

  async findAll(
    queryParams: TQueryParams
  ): Promise<Result<PaginatedResponse<TEntity>, DatabaseError>> {
    const whereConditions = this.buildWhereConditions(queryParams);
    const paginationParams = this.extractPaginationParams(queryParams);

    const config = {
      ...this.paginationConfig,
      whereConditions,
    };

    return await paginate<TEntity>(config, paginationParams);
  }

  async findOne(id: string): Promise<Result<TEntity, DatabaseError>> {
    // Type assertion for the id column - this is safe as all our tables have string id columns
    const idColumn = (this.table as unknown as Record<string, unknown>)
      .id as Parameters<typeof eq>[0];

    const result = await db
      .select()
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);

    const entity = result[0];
    if (!entity) {
      return {
        success: false,
        error: new DatabaseError('Entity not found'),
      };
    }

    return {
      success: true,
      data: entity as TEntity,
    };
  }

  async update(
    id: string,
    data: TUpdateEntity
  ): Promise<Result<TEntity, DatabaseError>> {
    const idColumn = (this.table as unknown as Record<string, unknown>)
      .id as Parameters<typeof eq>[0];

    const updateData = {
      ...data,
      updatedAt: new Date(),
    } as Record<string, unknown>;

    const [updatedEntity] = await db
      .update(this.table)
      .set(updateData)
      .where(eq(idColumn, id))
      .returning();

    if (!updatedEntity) {
      return {
        success: false,
        error: new DatabaseError('Updated Entity not found'),
      };
    }

    return {
      success: true,
      data: updatedEntity as TEntity,
    };
  }

  async delete(id: string): Promise<Result<boolean, DatabaseError>> {
    const idColumn = (this.table as unknown as Record<string, unknown>)
      .id as Parameters<typeof eq>[0];

    const [deletedEntity] = await db
      .delete(this.table)
      .where(eq(idColumn, id))
      .returning();

    if (!deletedEntity) {
      return {
        success: false,
        error: new DatabaseError('Entity not found'),
      };
    }

    return {
      success: true,
      data: true,
    };
  }

  async deleteMany(ids: string[]): Promise<Result<boolean, DatabaseError>> {
    if (!ids || ids.length === 0) {
      return {
        success: false,
        error: new DatabaseError('No IDs provided for deletion'),
      };
    }

    const idColumn = (this.table as unknown as Record<string, unknown>)
      .id as Parameters<typeof eq>[0];

    const deletedEntities = await db
      .delete(this.table)
      .where(inArray(idColumn, ids))
      .returning();

    if (!deletedEntities || deletedEntities.length === 0) {
      return {
        success: false,
        error: new DatabaseError('No entities found to delete'),
      };
    }

    return {
      success: true,
      data: true,
    };
  }

  protected extractPaginationParams(
    queryParams: TQueryParams
  ): PaginationParams {
    const limit = queryParams.limit ?? 20;
    const page = queryParams.page ?? 1;
    const offset = queryParams.offset ?? undefined;
    const sortBy = queryParams.sortBy ?? undefined;
    const sortOrder = queryParams.sortOrder ?? 'desc';
    const search = queryParams.search ?? undefined;

    return {
      limit,
      page,
      offset,
      sortBy,
      sortOrder,
      search,
    };
  }

  async createMany(
    data: TNewEntity[]
  ): Promise<Result<TEntity[], DatabaseError>> {
    if (!data || data.length === 0) {
      return {
        success: false,
        error: new DatabaseError('No data provided for bulk creation'),
      };
    }

    const result = await db
      .insert(this.table)
      .values(data as Record<string, unknown>[])
      .returning();

    if (!result || result.length === 0) {
      return {
        success: false,
        error: new DatabaseError(
          'Failed to create entities - no data returned'
        ),
      };
    }

    if (result.length !== data.length) {
      return {
        success: false,
        error: new DatabaseError(
          `Partial creation failure: expected ${data.length} entities, created ${result.length}`
        ),
      };
    }

    return {
      success: true,
      data: result as TEntity[],
    };
  }
}
