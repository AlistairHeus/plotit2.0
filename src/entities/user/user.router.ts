import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { UserController } from '@/entities/user/user.controller';
import { UserRepository } from '@/entities/user/user.repository';
import { UserService } from '@/entities/user/user.service';

const router = Router();

const repository = new UserRepository();

export const service = new UserService(repository);

const controller = new UserController(service);

// POST /api/users
router.post(
  '/',
  asyncHandler((req, res) => controller.createUser(req, res))
);

// GET /api/users
router.get(
  '/',
  asyncHandler((req, res) => controller.getUsers(req, res))
);

// GET /api/users/:id
router.get(
  '/:id',
  asyncHandler((req, res) => controller.getUserById(req, res))
);

// PATCH/api/users/:id
router.patch(
  '/:id',
  asyncHandler((req, res) => controller.updateUser(req, res))
);

// DELETE /api/users/:id
router.delete(
  '/:id',
  asyncHandler((req, res) => controller.deleteUser(req, res))
);

export default router;
