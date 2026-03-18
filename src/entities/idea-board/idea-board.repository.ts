import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { ideaBoards } from "@/entities/idea-board/idea-board.schema";
import type {
  CreateIdeaBoard,
  UpdateIdeaBoard,
  IdeaBoard,
  IdeaBoardQueryParams,
  IdeaBoardWithRelations,
} from "@/entities/idea-board/idea-board.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof ideaBoards> = {
  table: ideaBoards,
  searchColumns: [ideaBoards.name],
  sortableColumns: {
    id: ideaBoards.id,
    name: ideaBoards.name,
    createdAt: ideaBoards.createdAt,
    updatedAt: ideaBoards.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildWhereConditions(queryParams: IdeaBoardQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(eq(ideaBoards.name, queryParams.name));
  }

  if (
    "universeId" in queryParams &&
    typeof queryParams.universeId === "string"
  ) {
    whereConditions.push(
      eq(ideaBoards.universeId, queryParams.universeId),
    );
  }

  return whereConditions;
}

export class IdeaBoardRepository {
  async createIdeaBoard(
    data: CreateIdeaBoard,
  ): Promise<Result<IdeaBoard>> {
    try {
      const [result] = await db.insert(ideaBoards).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create idea-board"),
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
              "Failed to create idea-board",
              new Error(String(error)),
            ),
      };
    }
  }

  async updateIdeaBoard(
    id: string,
    data: UpdateIdeaBoard,
  ): Promise<Result<IdeaBoard>> {
    try {
      const [result] = await db
        .update(ideaBoards)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(ideaBoards.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("IdeaBoard", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to update idea-board",
              new Error(String(error)),
            ),
      };
    }
  }

  async deleteIdeaBoard(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(ideaBoards)
        .where(eq(ideaBoards.id, id))
        .returning({ id: ideaBoards.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to delete idea-board",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAllIdeaBoards(
    queryParams: IdeaBoardQueryParams,
  ): Promise<Result<PaginatedResponse<IdeaBoard>>> {
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
        return await db.query.ideaBoards.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });
      };

      return await paginate<IdeaBoard>(
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
              "Failed to find idea-boards",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOneIdeaBoard(id: string): Promise<Result<IdeaBoard>> {
    try {
      const result = await db.query.ideaBoards.findFirst({
        where: eq(ideaBoards.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("IdeaBoard", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find idea-board",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOneIdeaBoardWithRelations(
    id: string,
  ): Promise<Result<IdeaBoardWithRelations>> {
    try {
      const result = await db.query.ideaBoards.findFirst({
        where: eq(ideaBoards.id, id),
        with: {
          universe: true,
        },
      });

      if (!result) {
        return { success: false, error: new NotFoundError("IdeaBoard", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find idea-board with relations",
              new Error(String(error)),
            ),
      };
    }
  }
}
