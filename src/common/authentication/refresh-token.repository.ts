import { desc, eq, inArray, lt } from "drizzle-orm";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import db from "@/db/connection";
import type { CreateRefreshToken, RefreshToken } from "./authentication.types";
import { refreshTokens } from "./refresh-token.schema";
import type { Result } from "@/common/common.types";

export class RefreshTokenRepository {
  async create(data: CreateRefreshToken): Promise<Result<RefreshToken>> {
    try {
      const [result] = await db.insert(refreshTokens).values(data).returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create refresh token"),
        };
      }
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to create refresh token", new Error(String(error))),
      };
    }
  }

  async findByToken(token: string): Promise<Result<RefreshToken>> {
    try {
      const result = await db.query.refreshTokens.findFirst({
        where: eq(refreshTokens.token, token),
      });

      if (!result) {
        return { success: false, error: new NotFoundError("Refresh token") };
      }

      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to find refresh token", new Error(String(error))),
      };
    }
  }

  async findByUserId(userId: string): Promise<Result<RefreshToken[]>> {
    try {
      const result = await db.query.refreshTokens.findMany({
        where: eq(refreshTokens.userId, userId),
        orderBy: [desc(refreshTokens.createdAt)],
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to find user refresh tokens", new Error(String(error))),
      };
    }
  }

  async revokeToken(token: string): Promise<Result<void>> {
    try {
      await db
        .update(refreshTokens)
        .set({
          isRevoked: true,
          updatedAt: new Date(),
        })
        .where(eq(refreshTokens.token, token));
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to revoke refresh token", new Error(String(error))),
      };
    }
  }

  async revokeAllUserTokens(userId: string): Promise<Result<void>> {
    try {
      await db
        .update(refreshTokens)
        .set({
          isRevoked: true,
          updatedAt: new Date(),
        })
        .where(eq(refreshTokens.userId, userId));
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to revoke all user tokens", new Error(String(error))),
      };
    }
  }

  async deleteExpiredTokens(): Promise<Result<void>> {
    try {
      await db
        .delete(refreshTokens)
        .where(lt(refreshTokens.expiresAt, new Date()));
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to delete expired tokens", new Error(String(error))),
      };
    }
  }

  async deleteOldestTokensForUser(
    userId: string,
    keepCount: number,
  ): Promise<Result<void>> {
    try {
      const userTokensResult = await this.findByUserId(userId);
      if (!userTokensResult.success) return userTokensResult;
      const userTokens = userTokensResult.data;

      if (userTokens.length > keepCount) {
        const tokensToDelete = userTokens.slice(keepCount);
        const tokenIds = tokensToDelete.map((token: RefreshToken) => token.id);

        if (tokenIds.length > 0) {
          await db
            .delete(refreshTokens)
            .where(inArray(refreshTokens.id, tokenIds));
        }
      }
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError("Failed to delete oldest tokens", new Error(String(error))),
      };
    }
  }

  async isTokenValid(token: string): Promise<boolean> {
    const result = await this.findByToken(token);
    if (!result.success) return false;
    const refreshToken = result.data;
    return !refreshToken.isRevoked && refreshToken.expiresAt >= new Date();
  }
}
