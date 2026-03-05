import type { PaginationParams } from "@/common/pagination/pagination.types";
import type { Universe } from "@/entities/universe/universe.types";

export interface RootOfPower {
  id: string;
  universeId: string;
  name: string;
  description?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerSystem {
  id: string;
  rootOfPowerId: string;
  name: string;
  description?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerSubSystem {
  id: string;
  powerSystemId: string;
  name: string;
  description?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerCategory {
  id: string;
  powerSystemId?: string | null | undefined;
  subSystemId?: string | null | undefined;
  name: string;
  description?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerAbility {
  id: string;
  powerSystemId?: string | null | undefined;
  subSystemId?: string | null | undefined;
  categoryId?: string | null | undefined;
  name: string;
  description?: string | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export interface CharacterPowerAccess {
  id: string;
  characterId: string;
  powerSystemId?: string | null | undefined;
  subSystemId?: string | null | undefined;
  categoryId?: string | null | undefined;
  abilityId?: string | null | undefined;
  lastUsedAt?: Date | null | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export type PowerSystemWithRelations = PowerSystem & {
  rootOfPower: RootOfPower & { universe: Universe };
  subSystems: PowerSubSystem[];
  categories: PowerCategory[];
  abilities: PowerAbility[];
  characterAccess: CharacterPowerAccess[];
};

export type CreatePowerSystem = Omit<PowerSystem, "id" | "createdAt" | "updatedAt">;
export type UpdatePowerSystem = {
  [K in keyof CreatePowerSystem]?: CreatePowerSystem[K] | undefined;
};
export type PowerSystemQueryParams = PaginationParams & {
  name?: string | undefined;
  rootOfPowerId?: string | undefined;
};
