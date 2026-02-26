import bcrypt from 'bcryptjs';
import type { PaginatedResponse } from '@/common/pagination/pagination.types';
import db from '@/db/connection';
import type { UserRepository } from '@/entities/user/user.repository';
import type {
  CreateUser,
  CreateUserWithProfile,
  UpdateUser,
  UpdateUserWithProfile,
  User,
  UserDTO,
  UserQueryParams,
} from '@/entities/user/user.types';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUserWithProfile(data: CreateUserWithProfile): Promise<UserDTO> {
    return await db.transaction(async (_tx) => {
      const hashedPassword = await bcrypt.hash(data.user.password, 12);

      const userData: CreateUser = {
        ...data.user,
        password: hashedPassword,
      };

      const userResult = await this.userRepository.create(userData);
      if (!userResult.success) {
        throw userResult.error;
      }

      const user = userResult.data;

      const {
        password: _password,
        lastLoginAt: _lastLoginAt,
        ...safeUser
      } = user;

      return {
        user: safeUser,
        profile: {},
      };
    });
  }

  async updateUserWithProfile(
    id: string,
    data: UpdateUserWithProfile
  ): Promise<UserDTO> {
    return await db.transaction(async (_tx) => {
      const existingUser = await this.getUserById(id);

      if (!existingUser) {
        throw new Error('User not found');
      }

      let updatedUser = existingUser;

      if (data.user) {
        const userData = { ...data.user };
        if (userData.password) {
          userData.password = await bcrypt.hash(userData.password, 12);
        }

        const userResult = await this.userRepository.update(id, userData);
        if (!userResult.success) {
          throw userResult.error;
        }
        updatedUser = userResult.data;
      }

      const {
        password: _password,
        lastLoginAt: _lastLoginAt,
        ...safeUser
      } = updatedUser;

      return {
        user: safeUser,
        profile: {},
      };
    });
  }

  async createUser(data: CreateUser): Promise<User> {
    const result = await this.userRepository.create(data);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async updateUser(id: string, data: UpdateUser): Promise<User> {
    const result = await this.userRepository.update(id, data);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUsers(
    queryParams: UserQueryParams
  ): Promise<PaginatedResponse<User>> {
    const result = await this.userRepository.findAll(queryParams);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async getUsersWithProfiles(
    queryParams: UserQueryParams
  ): Promise<PaginatedResponse<UserDTO>> {
    const result = await this.userRepository.findAll(queryParams);

    if (!result.success) {
      throw result.error;
    }

    const usersWithProfiles = result.data.data.map((user) => {
      const {
        password: _password,
        lastLoginAt: _lastLoginAt,
        ...safeUser
      } = user;

      return {
        user: safeUser,
        profile: {},
      };
    });

    return {
      data: usersWithProfiles,
      pagination: result.data.pagination,
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await this.userRepository.findOne(id);

    if (!result.success) {
      return null;
    }

    return result.data;
  }

  async getUserWithProfileById(id: string): Promise<UserDTO | null> {
    const user = await this.getUserById(id);

    if (!user) {
      return null;
    }

    const {
      password: _password,
      lastLoginAt: _lastLoginAt,
      ...safeUser
    } = user;

    return {
      user: safeUser,
      profile: {},
    };
  }
}
