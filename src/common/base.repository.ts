import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import { DatabaseError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginationConfig,
  PaginationParams,
} from "@/common/pagination/pagination.types";
import { db } from "@/db/connection";
import { eq, getTableColumns, inArray, type SQL } from "drizzle-orm";
import { PgColumn, type PgTable } from "drizzle-orm/pg-core";

export abstract class BaseRepository<
  TEntity,
  TNewEntity extends Record<string, unknown>,
  TQueryParams extends PaginationParams,
> {
  protected abstract table: PgTable;
  protected abstract paginationConfig: PaginationConfig<PgTable>;
  protected abstract selectSchema: { parse: (data: unknown) => TEntity };

  protected abstract buildWhereConditions(queryParams: TQueryParams): SQL[];

  private getIdColumn(): PgColumn {
    const columns = getTableColumns(this.table);
    const idColumn = columns.id;
    if (!(idColumn instanceof PgColumn)) {
      throw new DatabaseError("Table does not have a valid ID column");
    }
    return idColumn;
  }

  async create(data: TNewEntity): Promise<TEntity> {
    const result = await db
      .insert(this.table)
      .values(data as Record<string, unknown>)
      .returning();
    const entity = result[0];

    if (!entity) {
      throw new DatabaseError("Failed to create entity - no data returned");
    }

    return this.selectSchema.parse(entity);
  }

  async findAll(
    queryParams: TQueryParams,
  ): Promise<PaginatedResponse<TEntity>> {
    const whereConditions = this.buildWhereConditions(queryParams);
    const paginationParams = this.extractPaginationParams(queryParams);

    const config = {
      ...this.paginationConfig,
      whereConditions,
    };

    const result = await paginate<TEntity>(config, paginationParams);
    if (!result.success) {
      throw result.error;
    }
    return result.data;
  }

  async findOne(id: string): Promise<TEntity> {
    const idColumn = this.getIdColumn();

    const result = await db
      .select()
      .from(this.table)
      .where(eq(idColumn, id))
      .limit(1);

    const entity = result[0];
    if (!entity) {
      throw new DatabaseError("Entity not found");
    }

    return this.selectSchema.parse(entity);
  }

  async update(
    id: string,
    data: Partial<TNewEntity>,
  ): Promise<TEntity> {
    const idColumn = this.getIdColumn();

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
      throw new DatabaseError("Updated Entity not found");
    }

    return this.selectSchema.parse(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const idColumn = this.getIdColumn();

    const [deletedEntity] = await db
      .delete(this.table)
      .where(eq(idColumn, id))
      .returning();

    if (!deletedEntity) {
      throw new DatabaseError("Entity not found");
    }

    return true;
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const idColumn = this.getIdColumn();

    const deletedEntities = await db
      .delete(this.table)
      .where(inArray(idColumn, ids))
      .returning();

    if (deletedEntities.length === 0) {
      throw new DatabaseError("No entities found to delete");
    }

    return true;
  }

  protected extractPaginationParams(
    queryParams: TQueryParams,
  ): PaginationParams {
    const limit = queryParams.limit ?? 20;
    const page = queryParams.page ?? 1;
    const offset = queryParams.offset ?? undefined;
    const sortBy = queryParams.sortBy ?? undefined;
    const sortOrder = queryParams.sortOrder ?? "desc";
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

  async createMany(data: TNewEntity[]): Promise<TEntity[]> {
    if (data.length === 0) {
      throw new DatabaseError("No data provided for bulk creation");
    }

    const result = await db
      .insert(this.table)
      .values(data as Record<string, unknown>[])
      .returning();

    if (result.length === 0) {
      throw new DatabaseError("Failed to create entities - no data returned");
    }

    if (result.length !== data.length) {
      throw new DatabaseError(
        `Partial creation failure: expected ${String(data.length)} entities, created ${String(result.length)}`,
      );
    }

    return result.map((item) => this.selectSchema.parse(item));
  }
}
