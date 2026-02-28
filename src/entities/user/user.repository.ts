import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { users } from "@/entities/user/user.schema";
import type {
  CreateUser,
  UpdateUser,
  User,
  UserQueryParams,
} from "@/entities/user/user.types";
import { eq, type SQL } from "drizzle-orm";
import type { Result } from "@/common/common.types";

const paginationConfig: PaginationConfig<typeof users> = {
  table: users,
  searchColumns: [users.firstName, users.lastName, users.email],
  sortableColumns: {
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
    lastLoginAt: users.lastLoginAt,
  },
  defaultSortBy: "createdAt",
};

function buildWhereConditions(queryParams: UserQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  if ("email" in queryParams && typeof queryParams.email === "string") {
    whereConditions.push(eq(users.email, queryParams.email));
  }

  return whereConditions;
}

export class UserRepository {
  async create(data: CreateUser): Promise<Result<User>> {
    try {
      const [result] = await db.insert(users).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create user"),
        };
      }
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to create user", new Error(String(error))),
      };
    }
  }

  async update(id: string, data: UpdateUser): Promise<Result<User>> {
    try {
      const [result] = await db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning();

      if (!result) {
        return { success: false, error: new NotFoundError("User", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to update user", new Error(String(error))),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(users)
        .where(eq(users.id, id))
        .returning({ id: users.id });

      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to delete user", new Error(String(error))),
      };
    }
  }

  async findAll(queryParams: UserQueryParams): Promise<Result<PaginatedResponse<User>>> {
    try {
      const dynamicConditions = buildWhereConditions(queryParams);

      const configWithConditions = {
        ...paginationConfig,
        whereConditions: [
          ...(paginationConfig.whereConditions ?? []),
          ...dynamicConditions,
        ],
      };

      return await paginate<User>(
        configWithConditions,
        queryParams,
        async ({ where, orderBy, limit, offset }) => {
          return await db.query.users.findMany({
            where,
            orderBy: [orderBy],
            limit,
            offset,
          });
        }
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to find users", new Error(String(error))),
      };
    }
  }

  async findOne(id: string): Promise<Result<User>> {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.id, id),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("User", id) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to find user", new Error(String(error))),
      };
    }
  }

  async findByEmail(email: string): Promise<Result<User>> {
    try {
      const result = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("User", email) };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to find user by email", new Error(String(error))),
      };
    }
  }

  async updateLastLogin(userId: string): Promise<Result<void>> {
    try {
      await db
        .update(users)
        .set({ lastLoginAt: new Date() })
        .where(eq(users.id, userId));
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to update last login", new Error(String(error))),
      };
    }
  }
}
