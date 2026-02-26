import { eq, type SQL } from 'drizzle-orm';
import { BaseRepository } from '@/common/base.repository';
import type { Result } from '@/common/common.types';
import { NotFoundError } from '@/common/error.types';
import type { PaginationConfig } from '@/common/pagination/pagination.types';
import db from '@/db/connection';
import { users } from '@/entities/user/user.schema';
import type {
  CreateUser,
  UpdateUser,
  User,
  UserQueryParams,
} from '@/entities/user/user.types';

export class UserRepository extends BaseRepository<
  User,
  CreateUser,
  UpdateUser,
  UserQueryParams
> {
  protected table = users;

  protected paginationConfig: PaginationConfig<typeof users> = {
    table: users,
    searchColumns: [users.firstName, users.lastName, users.email],
    sortableColumns: {
      id: users.id,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      role: users.role,
      dateOfBirth: users.dateOfBirth,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastLoginAt: users.lastLoginAt,
      phoneNumber: users.phoneNumber,
      profilePicture: users.profilePicture,
      primaryLanguage: users.primaryLanguage,
      gender: users.gender,
    },
    defaultSortBy: 'createdAt',
  };

  protected buildWhereConditions(queryParams: UserQueryParams): SQL<unknown>[] {
    const whereConditions: SQL<unknown>[] = [];

    const filters = queryParams;

    if (filters.role) {
      whereConditions.push(eq(users.role, filters.role));
    }

    if (filters.gender) {
      whereConditions.push(eq(users.gender, filters.gender));
    }

    return whereConditions;
  }

  async findByEmail(email: string): Promise<Result<User, NotFoundError>> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!result) {
      return {
        success: false,
        error: new NotFoundError('User'),
      };
    }

    return {
      success: true,
      data: result,
    };
  }

  async findUserWithProfile(id: string) {
    const userData = await db.query.users.findFirst({
      columns: {
        password: false,
      },
      where: eq(users.id, id),
    });

    if (!userData) {
      throw new Error('User not found');
    }

    return {
      user: userData,
      profile: {},
    };
  }

  async updateLastLogin(userId: string) {
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, userId));
  }
}
