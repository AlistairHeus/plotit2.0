import { BaseRepository } from "@/common/base.repository";
import type { Result } from "@/common/common.types";
import { NotFoundError } from "@/common/error.types";
import type { PaginationConfig } from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { users } from "@/entities/user/user.schema";
import type {
  CreateUser,
  User,
  UserQueryParams
} from "@/entities/user/user.types";
import { userSchema } from "@/entities/user/user.validation";
import { eq, type SQL } from "drizzle-orm";

export class UserRepository extends BaseRepository<
  User,
  CreateUser,
  UserQueryParams
> {
  protected table = users;
  protected selectSchema = userSchema;

  protected paginationConfig: PaginationConfig<typeof users> = {
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

  protected buildWhereConditions(): SQL[] {
    const whereConditions: SQL[] = [];

    return whereConditions;
  }

  async findByEmail(email: string): Promise<Result<User, NotFoundError>> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!result) {
      return {
        success: false,
        error: new NotFoundError("User"),
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  async updateLastLogin(userId: string) {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId));
  }
}
