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
import { eq } from "drizzle-orm";

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

export class UserRepository {
  async create(data: CreateUser): Promise<User> {
    const [result] = await db.insert(users).values(data).returning();
    if (!result) {
      throw new DatabaseError("Failed to create user");
    }
    return result;
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const [result] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    if (!result) {
      throw new NotFoundError("User", id);
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    const [result] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return result !== undefined;
  }

  async findAll(queryParams: UserQueryParams): Promise<PaginatedResponse<User>> {
    // We pass a specific queryBuilder for Users
    const result = await paginate<User>(
      paginationConfig,
      queryParams,
      async ({ where, orderBy, limit, offset }) => {
        return await db
          .select()
          .from(users)
          .where(where)
          .orderBy(orderBy)
          .limit(limit)
          .offset(offset);
      }
    );

    if (!result.success) throw result.error;
    return result.data;
  }

  async findOne(id: string): Promise<User> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!result) {
      throw new NotFoundError("User", id);
    }

    return result;
  }

  async findByEmail(email: string): Promise<User> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!result) {
      throw new NotFoundError("User", email);
    }

    return result;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId));
  }
}
