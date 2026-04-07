import type { Result } from "@/common/common.types";
import { DatabaseError, NotFoundError } from "@/common/error.types";
import { paginate } from "@/common/pagination/pagination.service";
import type {
  PaginatedResponse,
  PaginationConfig,
} from "@/common/pagination/pagination.types";
import db from "@/db/connection";
import { characters } from "@/entities/character/character.schema";
import type {
  Character,
  CharacterQueryParams,
  CharacterWithRelations,
  CreateCharacter,
  SyncCharacterPowerAccess,
  UpdateCharacter,
} from "@/entities/character/character.types";
import { characterPowerAccess } from "@/entities/power-system/power-system.schema";
import type { CharacterPowerAccess } from "@/entities/power-system/power-system.types";
import { eq, type SQL } from "drizzle-orm";

const paginationConfig: PaginationConfig<typeof characters> = {
  table: characters,
  searchColumns: [characters.name],
  sortableColumns: {
    id: characters.id,
    name: characters.name,
    createdAt: characters.createdAt,
    updatedAt: characters.updatedAt,
  },
  defaultSortBy: "createdAt",
};

import { races } from "@/entities/race/race.schema";
import { universes } from "@/entities/universe/universe.schema";
import { gte, ilike, inArray, lte } from "drizzle-orm";
import { CHARACTER_GENDERS, CHARACTER_TYPES } from "@/entities/character/character.constants";

function buildWhereConditions(queryParams: CharacterQueryParams): SQL[] {
  const whereConditions: SQL[] = [];

  // --- 1. Identity Search ---
  if ("name" in queryParams && typeof queryParams.name === "string") {
    whereConditions.push(ilike(characters.name, `%${queryParams.name}%`));
  }

  // --- 2. Enum Type Guard (Character Type) ---
  if ("type" in queryParams && queryParams.type) {
    const typeValue = queryParams.type;
    const validType = CHARACTER_TYPES.find((t) => t === typeValue);
    if (validType) {
      whereConditions.push(eq(characters.type, validType));
    }
  }

  // --- 3. Boolean Check ---
  if ("benched" in queryParams && typeof queryParams.benched === "boolean") {
    whereConditions.push(eq(characters.benched, queryParams.benched));
  }

  // --- 4. Age Range Logic ---
  if ("minAge" in queryParams && typeof queryParams.minAge === "number") {
    whereConditions.push(gte(characters.age, queryParams.minAge));
  }
  if ("maxAge" in queryParams && typeof queryParams.maxAge === "number") {
    whereConditions.push(lte(characters.age, queryParams.maxAge));
  }

  // --- 5. Gender Type Guard ---
  if ("gender" in queryParams && queryParams.gender) {
    const genderValue = queryParams.gender;
    const validGender = CHARACTER_GENDERS.find((g) => g === genderValue);
    if (validGender) {
      whereConditions.push(eq(characters.gender, validGender));
    }
  }

  // --- 6. Relational Filtering (Race) ---
  if ("raceId" in queryParams && typeof queryParams.raceId === "string") {
    whereConditions.push(eq(characters.raceId, queryParams.raceId));
  } else if ("raceName" in queryParams && typeof queryParams.raceName === "string") {
    const raceNameVal = queryParams.raceName;
    const raceSubquery = db
      .select({ id: races.id })
      .from(races)
      .where(ilike(races.name, `%${raceNameVal}%`));

    whereConditions.push(inArray(characters.raceId, raceSubquery));
  }

  // --- 7. Relational Filtering (Universe) ---
  if ("universeId" in queryParams && typeof queryParams.universeId === "string") {
    whereConditions.push(eq(characters.universeId, queryParams.universeId));
  } else if ("universeName" in queryParams && typeof queryParams.universeName === "string") {
    const universeNameVal = queryParams.universeName;
    const universeSubquery = db
      .select({ id: universes.id })
      .from(universes)
      .where(ilike(universes.name, `%${universeNameVal}%`));

    whereConditions.push(inArray(characters.universeId, universeSubquery));
  }

  return whereConditions;
}

export class CharacterRepository {
  async create(data: CreateCharacter): Promise<Result<Character>> {
    try {
      const [result] = await db
        .insert(characters)
        .values({
          ...data,
          raceId: data.raceId,
          ethnicGroupId: data.ethnicGroupId,
        })
        .returning();
      if (!result) {
        return {
          success: false,
          error: new DatabaseError("Failed to create character"),
        };
      }
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to create character",
              new Error(String(error)),
            ),
      };
    }
  }

  async update(id: string, data: UpdateCharacter): Promise<Result<Character>> {
    try {
      const [result] = await db
        .update(characters)
        .set(data)
        .where(eq(characters.id, id))
        .returning();

      if (!result)
        return { success: false, error: new NotFoundError("Character", id) };
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to update character",
              new Error(String(error)),
            ),
      };
    }
  }

  async delete(id: string): Promise<Result<boolean>> {
    try {
      const [result] = await db
        .delete(characters)
        .where(eq(characters.id, id))
        .returning({ id: characters.id });
      return { success: true, data: result !== undefined };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to delete character",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAll(
    queryParams: CharacterQueryParams,
  ): Promise<Result<PaginatedResponse<Character>>> {
    try {
      const configWithConditions = {
        ...paginationConfig,
        whereConditions: [
          ...(paginationConfig.whereConditions ?? []),
          ...buildWhereConditions(queryParams),
        ],
      };

      const queryBuilder = async ({
        where,
        orderBy,
        limit,
        offset,
      }: {
        where: SQL | undefined;
        orderBy: SQL;
        limit: number;
        offset: number;
      }) =>
        db.query.characters.findMany({
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });

      return await paginate<Character>(
        configWithConditions,
        queryParams,
        queryBuilder,
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find characters",
              new Error(String(error)),
            ),
      };
    }
  }

  async findAllWithRelations(
    queryParams: CharacterQueryParams,
  ): Promise<Result<PaginatedResponse<CharacterWithRelations>>> {
    try {
      const configWithConditions = {
        ...paginationConfig,
        whereConditions: [
          ...(paginationConfig.whereConditions ?? []),
          ...buildWhereConditions(queryParams),
        ],
      };

      const queryBuilder = async ({
        where,
        orderBy,
        limit,
        offset,
      }: {
        where: SQL | undefined;
        orderBy: SQL;
        limit: number;
        offset: number;
      }) =>
        db.query.characters.findMany({
          with: { universe: true, race: true, ethnicGroup: true },
          where,
          orderBy: [orderBy],
          limit,
          offset,
        });

      return await paginate<CharacterWithRelations>(
        configWithConditions,
        queryParams,
        queryBuilder,
      );
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find characters with relations",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOne(id: string): Promise<Result<Character>> {
    try {
      const result = await db.query.characters.findFirst({
        where: eq(characters.id, id),
      });
      if (!result)
        return { success: false, error: new NotFoundError("Character", id) };
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find character",
              new Error(String(error)),
            ),
      };
    }
  }

  async findOneWithRelations(
    id: string,
  ): Promise<Result<CharacterWithRelations>> {
    try {
      const result = await db.query.characters.findFirst({
        where: eq(characters.id, id),
        with: {
          universe: true,
          race: true,
          ethnicGroup: true,
          powerAccess: true,
        },
      });
      if (!result)
        return { success: false, error: new NotFoundError("Character", id) };
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to find character with relations",
              new Error(String(error)),
            ),
      };
    }
  }

  async getPowerAccess(
    characterId: string,
  ): Promise<Result<CharacterPowerAccess[]>> {
    try {
      const result = await db.query.characterPowerAccess.findMany({
        where: eq(characterPowerAccess.characterId, characterId),
        with: {
          powerSystem: true,
          subSystem: true,
          category: true,
          ability: true,
        },
      });
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to fetch character power access",
              new Error(String(error)),
            ),
      };
    }
  }

  async syncPowerAccess(
    characterId: string,
    data: SyncCharacterPowerAccess,
  ): Promise<Result<CharacterPowerAccess[]>> {
    try {
      await db.transaction(async (tx) => {
        await tx
          .delete(characterPowerAccess)
          .where(eq(characterPowerAccess.characterId, characterId));

        if (data.powers.length > 0) {
          const values = data.powers.map((p) => ({
            characterId,
            powerSystemId: p.powerSystemId ?? null,
            subSystemId: p.subSystemId ?? null,
            categoryId: p.categoryId ?? null,
            abilityId: p.abilityId ?? null,
          }));

          const uniqueValues = values.filter(
            (val, index, self) =>
              index ===
              self.findIndex(
                (t) =>
                  t.powerSystemId === val.powerSystemId &&
                  t.subSystemId === val.subSystemId &&
                  t.categoryId === val.categoryId &&
                  t.abilityId === val.abilityId,
              ),
          );

          await tx.insert(characterPowerAccess).values(uniqueValues);
        }
      });

      return await this.getPowerAccess(characterId);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error
            : new DatabaseError(
              "Failed to sync character power access",
              new Error(String(error)),
            ),
      };
    }
  }
}
