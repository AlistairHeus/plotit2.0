import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
  PaginationParams,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import {
  characterRelationships,
  factions,
} from "@/entities/faction/faction.schema";
import type {
  CharacterRelationship,
  CharacterRelationshipWithCharacters,
  CreateFaction,
  CreateRelationship,
  Faction,
  FactionQueryParams,
  FactionWithRelations,
  RelationshipQueryParams,
  UpdateFaction,
  UpdateRelationship,
} from "@/entities/faction/faction.types";
import { and, eq, or, type SQL } from "drizzle-orm";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const paginationConfig: PaginationConfig<typeof factions> = {
  table: factions,
  searchColumns: [factions.name],
  sortableColumns: {
    id: factions.id,
    name: factions.name,
    type: factions.type,
    createdAt: factions.createdAt,
    updatedAt: factions.updatedAt,
  },
  defaultSortBy: "updatedAt",
};

function buildFactionWhere(queryParams: FactionQueryParams): SQL[] {
  const where: SQL[] = [];
  if (queryParams.universeId) where.push(eq(factions.universeId, queryParams.universeId));
  if (queryParams.name) where.push(eq(factions.name, queryParams.name));
  if (queryParams.type) where.push(eq(factions.type, queryParams.type));
  return where;
}

function toPaginationParams(p: FactionQueryParams): PaginationParams {
  const sortOrderRaw = p.sortOrder;
  return {
    limit: p.limit,
    page: p.page,
    offset: p.offset,
    sortBy: p.sortBy,
    search: p.search,
    ...(sortOrderRaw === "asc" || sortOrderRaw === "desc" ? { sortOrder: sortOrderRaw } : {}),
  };
}

// ─── Faction CRUD ─────────────────────────────────────────────────────────────

export class FactionRepository {
  async create(data: CreateFaction): Promise<Result<Faction>> {
    try {
      const [result] = await db.insert(factions).values(data).returning();
      if (!result) return { success: false, error: new DatabaseError("Failed to create faction") };
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to create faction", new Error(String(error))) };
    }
  }

  async update(id: string, data: UpdateFaction): Promise<Result<Faction>> {
    try {
      const [result] = await db.update(factions).set({ ...data, updatedAt: new Date() }).where(eq(factions.id, id)).returning();
      if (!result) return { success: false, error: new NotFoundError("Faction", id) };
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to update faction", new Error(String(error))) };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db.delete(factions).where(eq(factions.id, id)).returning({ id: factions.id });
      return { success: true, data: result !== undefined };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to delete faction", new Error(String(error))) };
    }
  }

  async findAll(queryParams: FactionQueryParams): Promise<Result<PaginatedResponse<Faction>>> {
    try {
      const configWithConditions = {
        ...paginationConfig,
        whereConditions: [...(paginationConfig.whereConditions ?? []), ...buildFactionWhere(queryParams)],
      };
      const queryBuilder = async ({ where, orderBy, limit, offset }: { where: SQL | undefined; orderBy: SQL; limit: number; offset: number }) =>
        db.query.factions.findMany({ where, orderBy: [orderBy], limit, offset });

      return await paginate<Faction>(configWithConditions, toPaginationParams(queryParams), queryBuilder);
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to find factions", new Error(String(error))) };
    }
  }

  async findOne(id: string): Promise<Result<Faction>> {
    try {
      const result = await db.query.factions.findFirst({ where: eq(factions.id, id) });
      if (!result) return { success: false, error: new NotFoundError("Faction", id) };
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to find faction", new Error(String(error))) };
    }
  }

  async findOneWithRelations(id: string): Promise<Result<FactionWithRelations>> {
    try {
      const result = await db.query.factions.findFirst({
        where: eq(factions.id, id),
        with: { universe: true, relationships: true },
      });
      if (!result) return { success: false, error: new NotFoundError("Faction", id) };
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to find faction", new Error(String(error))) };
    }
  }

  // ── Character Relationships ───────────────────────────────────────────────────

  async createRelationship(data: CreateRelationship): Promise<Result<CharacterRelationship>> {
    try {
      const [result] = await db.insert(characterRelationships).values(data).returning();
      if (!result) return { success: false, error: new DatabaseError("Failed to create relationship") };
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to create relationship", new Error(String(error))) };
    }
  }

  async updateRelationship(id: string, data: UpdateRelationship): Promise<Result<CharacterRelationship>> {
    try {
      const [result] = await db.update(characterRelationships).set({ ...data, updatedAt: new Date() }).where(eq(characterRelationships.id, id)).returning();
      if (!result) return { success: false, error: new NotFoundError("Relationship", id) };
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to update relationship", new Error(String(error))) };
    }
  }

  async deleteRelationship(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db.delete(characterRelationships).where(eq(characterRelationships.id, id)).returning({ id: characterRelationships.id });
      return { success: true, data: result !== undefined };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to delete relationship", new Error(String(error))) };
    }
  }

  async findRelationships(queryParams: RelationshipQueryParams): Promise<Result<CharacterRelationshipWithCharacters[]>> {
    try {
      const where: SQL[] = [];
      if (queryParams.universeId) where.push(eq(characterRelationships.universeId, queryParams.universeId));
      if (queryParams.factionId) where.push(eq(characterRelationships.factionId, queryParams.factionId));
      if (queryParams.type) where.push(eq(characterRelationships.type, queryParams.type));
      if (queryParams.sourceCharacterId) {
        const orCondition = or(
          eq(characterRelationships.sourceCharacterId, queryParams.sourceCharacterId),
          eq(characterRelationships.targetCharacterId, queryParams.sourceCharacterId),
        );
        if (orCondition) where.push(orCondition);
      }

      const results = await db.query.characterRelationships.findMany({
        where: where.length > 0 ? and(...where) : undefined,
        with: { source: true, target: true, faction: true },
      });

      return { success: true, data: results };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error : new DatabaseError("Failed to find relationships", new Error(String(error))) };
    }
  }
}
