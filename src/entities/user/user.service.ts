import bcrypt from 'bcryptjs';
import type { PaginatedResponse } from '@/common/pagination/pagination.types';
import type { UserRepository } from '@/entities/user/user.repository';
import type {
  CreateUser,
  UpdateUser,
  User,
  UserQueryParams,
} from '@/entities/user/user.types';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async createUser(data: CreateUser): Promise<User> {
    const userData = { ...data };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const result = await this.userRepository.create(userData);

    if (!result.success) {
      throw result.error;
    }

    return result.data;
  }

  async updateUser(id: string, data: UpdateUser): Promise<User> {
    const userData = { ...data };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const result = await this.userRepository.update(id, userData);

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

  async getUserById(id: string): Promise<User | null> {
    const result = await this.userRepository.findOne(id);

    if (!result.success) {
      return null;
    }

    return result.data;
  }
}
