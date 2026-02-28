import bcrypt from "bcryptjs";
import type { PaginatedResponse } from "@/common/pagination/pagination.types";
import type { UserRepository } from "@/entities/user/user.repository";
import type {
  CreateUser,
  UpdateUser,
  User,
  UserQueryParams,
} from "@/entities/user/user.types";

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
    return await this.userRepository.create(userData);
  }

  async updateUser(id: string, data: UpdateUser): Promise<User> {
    const userData = { ...data };
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUsers(
    queryParams: UserQueryParams,
  ): Promise<PaginatedResponse<User>> {
    return await this.userRepository.findAll(queryParams);
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne(id);
    } catch {
      return null;
    }
  }
}
