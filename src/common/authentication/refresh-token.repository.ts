import { desc, eq, inArray, lt } from 'drizzle-orm';
import type { Result } from '@/common/common.types';
import { NotFoundError } from '@/common/error.types';
import db from '@/db/connection';
import type { CreateRefreshToken, RefreshToken } from './authentication.types';
import { refreshTokens } from './refresh-token.schema';

export class RefreshTokenRepository {
  async create(data: CreateRefreshToken): Promise<RefreshToken> {
    const [result] = await db.insert(refreshTokens).values(data).returning();
    if (!result) {
      throw new Error('Failed to create refresh token');
    }
    return result;
  }

  async findByToken(
    token: string
  ): Promise<Result<RefreshToken, NotFoundError>> {
    const result = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    if (!result || result.length === 0) {
      return {
        success: false,
        error: new NotFoundError('Refresh token'),
      };
    }

    return {
      success: true,
      data: result[0] as RefreshToken,
    };
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .orderBy(desc(refreshTokens.createdAt));
  }

  async revokeToken(token: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({
        isRevoked: true,
        updatedAt: new Date(),
      })
      .where(eq(refreshTokens.token, token));
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await db
      .update(refreshTokens)
      .set({
        isRevoked: true,
        updatedAt: new Date(),
      })
      .where(eq(refreshTokens.userId, userId));
  }

  async deleteExpiredTokens(): Promise<void> {
    await db
      .delete(refreshTokens)
      .where(lt(refreshTokens.expiresAt, new Date()));
  }

  async deleteOldestTokensForUser(
    userId: string,
    keepCount: number
  ): Promise<void> {
    // Get all tokens for user, ordered by creation date (newest first)
    const userTokens = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .orderBy(desc(refreshTokens.createdAt));

    // If user has more tokens than allowed, delete the oldest ones
    if (userTokens.length > keepCount) {
      const tokensToDelete = userTokens.slice(keepCount);
      const tokenIds = tokensToDelete.map((token: RefreshToken) => token.id);

      if (tokenIds.length > 0) {
        await db
          .delete(refreshTokens)
          .where(inArray(refreshTokens.id, tokenIds));
      }
    }
  }

  async isTokenValid(token: string): Promise<boolean> {
    const result = await this.findByToken(token);

    if (!result.success) {
      return false;
    }

    const refreshToken = result.data;

    // Check if token is revoked or expired
    if (refreshToken.isRevoked || refreshToken.expiresAt < new Date()) {
      return false;
    }

    return true;
  }
}
