// import type { NextFunction, Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { beforeEach, describe, expect, it, vi } from 'vitest';
// import { AUTH_CONSTANTS } from '@/common/authentication/authentication.constants';
// import { authenticateToken, authorize } from '@/middleware/auth.middleware';

// // Mock jwt
// vi.mock('jsonwebtoken', () => ({
//   default: {
//     verify: vi.fn(),
//   },
// }));

// const mockJwtVerify = jwt.verify as ReturnType<typeof vi.fn>;

// describe('Auth Middleware Suite', () => {
//   let mockReq: Partial<Request>;
//   let mockRes: Partial<Response>;
//   let mockNext: NextFunction;

//   beforeEach(() => {
//     mockReq = {
//       headers: {},
//       params: {},
//       route: { path: '/test' },
//       path: '/test',
//     };
//     mockRes = {
//       status: vi.fn().mockReturnThis(),
//       json: vi.fn().mockReturnThis(),
//     };
//     mockNext = vi.fn();
//     vi.clearAllMocks();
//   });

//   describe('authenticateToken', () => {
//     const middleware = authenticateToken();

//     it('should return 401 when no authorization header is provided', () => {
//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(401);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         error: 'Authentication token required',
//       });
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should return 401 when authorization header does not start with Bearer', () => {
//       mockReq.headers = { authorization: 'Basic token123' };

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(401);
//       expect(mockRes.status).toHaveBeenCalledTimes(1);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         error: 'Authentication token required',
//       });
//       expect(mockRes.json).toHaveBeenCalledTimes(1);
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should return 401 when Bearer token is empty', () => {
//       mockReq.headers = { authorization: 'Bearer ' };

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(401);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         error: 'Authentication token required',
//       });
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should return 401 when JWT verification fails', () => {
//       mockReq.headers = { authorization: 'Bearer invalid-token' };
//       mockJwtVerify.mockImplementation(() => {
//         throw new Error('Invalid token');
//       });

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(401);
//       expect(mockRes.status).toHaveBeenCalledTimes(1);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         error: 'Invalid or expired token',
//       });
//       expect(mockRes.json).toHaveBeenCalledTimes(1);
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should return 401 when JWT token is expired', () => {
//       mockReq.headers = { authorization: 'Bearer expired-token' };
//       const expiredError = new Error('jwt expired');
//       expiredError.name = 'TokenExpiredError';
//       mockJwtVerify.mockImplementation(() => {
//         throw expiredError;
//       });

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(401);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         error: 'Invalid or expired token',
//       });
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should attach user to request and call next when token is valid', () => {
//       const mockPayload = {
//         id: 'user123',
//         email: 'test@example.com',
//         role: 'student',
//         profileId: 'profile123',
//         institutionId: 'inst123',
//       };

//       mockReq.headers = { authorization: 'Bearer valid-token' };
//       mockJwtVerify.mockReturnValue(mockPayload as jwt.JwtPayload);

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockJwtVerify).toHaveBeenCalledWith(
//         'valid-token',
//         AUTH_CONSTANTS.JWT_SECRET
//       );
//       expect(mockReq.user).toEqual({
//         id: 'user123',
//         email: 'test@example.com',
//         role: 'student',
//         profileId: 'profile123',
//         institutionId: 'inst123',
//       });
//       expect(mockNext).toHaveBeenCalled();
//       expect(mockRes.status).not.toHaveBeenCalled();
//     });

//     it('should handle user without institutionId', () => {
//       const mockPayload = {
//         id: 'user123',
//         email: 'test@example.com',
//         role: 'super_admin',
//         profileId: 'profile123',
//       };

//       mockReq.headers = { authorization: 'Bearer valid-token' };
//       mockJwtVerify.mockReturnValue(mockPayload as jwt.JwtPayload);

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockReq.user).toEqual({
//         id: 'user123',
//         email: 'test@example.com',
//         role: 'super_admin',
//         profileId: 'profile123',
//       });
//       expect(mockNext).toHaveBeenCalled();
//     });
//   });

//   describe('authorize', () => {
//     const mockUser = {
//       id: 'user123',
//       email: 'test@example.com',
//       role: 'student' as const,
//       profileId: 'profile123',
//       institutionId: 'inst123',
//     };

//     beforeEach(() => {
//       (mockReq as Request).user = mockUser;
//     });

//     it('should call next when policy function returns true', () => {
//       const mockPolicy = vi.fn().mockReturnValue(true);
//       const middleware = authorize(mockPolicy);

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockPolicy).toHaveBeenCalledWith(mockUser, expect.any(Object));
//       expect(mockNext).toHaveBeenCalled();
//       expect(mockRes.status).not.toHaveBeenCalled();
//     });

//     it('should return 403 when policy function returns false', () => {
//       const mockPolicy = vi.fn().mockReturnValue(false);
//       const middleware = authorize(mockPolicy);

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockPolicy).toHaveBeenCalledWith(mockUser, expect.any(Object));
//       expect(mockRes.status).toHaveBeenCalledWith(403);
//       expect(mockRes.json).toHaveBeenCalledWith({ error: 'Access denied' });
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should return 500 when policy function throws an error', () => {
//       const mockPolicy = vi.fn().mockImplementation(() => {
//         throw new Error('Policy error');
//       });
//       const middleware = authorize(mockPolicy);

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockRes.status).toHaveBeenCalledWith(500);
//       expect(mockRes.json).toHaveBeenCalledWith({
//         error: 'Authorization check failed',
//       });
//       expect(mockNext).not.toHaveBeenCalled();
//     });

//     it('should pass resource data to policy function', () => {
//       const mockPolicy = vi.fn().mockReturnValue(true);
//       const middleware = authorize(mockPolicy);
//       mockReq.params = { id: 'resource123' };

//       middleware(mockReq as Request, mockRes as Response, mockNext);

//       expect(mockPolicy).toHaveBeenCalledWith(mockUser, {
//         id: 'resource123',
//         route: '/test',
//         params: { id: 'resource123' },
//       });
//     });
//   });
// });
