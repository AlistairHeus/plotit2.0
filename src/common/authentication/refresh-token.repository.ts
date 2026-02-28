import { desc, eq, inArray, lt } from "drizzle-orm";
import { NotFoundError } from "@/common/error.types";
import db from "@/db/connection";
import type { CreateRefreshToken, RefreshToken } from "./authentication.types";
import { refreshTokens } from "./refresh-token.schema";

export class RefreshTokenRepository {
  async create(data: CreateRefreshToken): Promise<RefreshToken> {
    const [result] = await db.insert(refreshTokens).values(data).returning();
    if (!result) {
      throw new Error("Failed to create refresh token");
    }
    return result;
  }

  async findByToken(token: string): Promise<RefreshToken> {
    const result = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);

    const data = result[0];
    if (!data) {
      throw new NotFoundError("Refresh token");
    }

    return data;
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
    keepCount: number,
  ): Promise<void> {
    const userTokens = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .orderBy(desc(refreshTokens.createdAt));

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

  /**
   * Returns false if the token doesn't exist, is revoked, or is expired.
   * Uses a try/catch instead of Result so findByToken can throw normally.
   */
  async isTokenValid(token: string): Promise<boolean> {
    try {
      const refreshToken = await this.findByToken(token);
      return !refreshToken.isRevoked && refreshToken.expiresAt >= new Date();
    } catch {
      return false;
    }
  }
}
