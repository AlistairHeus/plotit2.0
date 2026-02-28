import type { Request, Response } from 'express';
import { paramsSchema } from '@/common/common.validation';
import { NotFoundError } from '@/common/error.types';
import type { UserService } from '@/entities/user/user.service';
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from '@/entities/user/user.validation';
import {
  validateBody,
  validateParams,
  validateQuery,
} from '@/middleware/validation.middleware';
import log from '@/utils/logger';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const userDataBody = validateBody(req.body, createUserSchema);
    const user = await this.userService.createUser(userDataBody);

    log.info('User created successfully', {
      userId: user.id,
      operation: 'create_user',
    });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully',
    });
  }

  async getUsers(req: Request, res: Response): Promise<void> {
    const userDataQuery = validateQuery(req.query, userQuerySchema);

    const result = await this.userService.getUsers(userDataQuery);

    log.info('Users retrieved successfully', {
      count: result.data.length,
      totalItems: result.pagination.totalItems,
      currentPage: result.pagination.currentPage,
      operation: 'get_all_users',
    });

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
      message: 'Users retrieved successfully',
    });
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userData = validateParams(id, paramsSchema);

    const user = await this.userService.getUserById(userData);

    if (!user) {
      throw new NotFoundError('User', userData);
    }
    res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully',
    });
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = validateParams(req.params.id, paramsSchema);
    const bodyValidation = validateBody(req.body, updateUserSchema);

    const user = await this.userService.updateUser(userId, bodyValidation);

    log.info('User updated successfully', {
      userId: user.id,
      operation: 'update_user',
    });

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const userId = validateParams(req.params.id, paramsSchema);

    await this.userService.deleteUser(userId);

    log.info('User deleted successfully', {
      userId,
      operation: 'delete_user',
    });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  }
}
