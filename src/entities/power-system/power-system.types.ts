import type { Universe } from "@/entities/universe/universe.types";
import {
  updatePowerSystemSchema,
  updateRootOfPowerSchema,
  updatePowerSubSystemSchema,
  updatePowerCategorySchema,
  updatePowerAbilitySchema,
  powerSystemQuerySchema,
} from "./power-system.validation";
import { z } from "zod";

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

// --- Generic Types ---
export type CreateRootOfPower = Omit<RootOfPower, "id" | "createdAt" | "updatedAt">;
export type UpdateRootOfPower = z.infer<typeof updateRootOfPowerSchema>;

export type CreatePowerSystem = Omit<PowerSystem, "id" | "createdAt" | "updatedAt">;
export type UpdatePowerSystem = z.infer<typeof updatePowerSystemSchema>;

export type CreatePowerSubSystem = Omit<PowerSubSystem, "id" | "createdAt" | "updatedAt">;
export type UpdatePowerSubSystem = z.infer<typeof updatePowerSubSystemSchema>;

export type CreatePowerCategory = Omit<PowerCategory, "id" | "createdAt" | "updatedAt">;
export type UpdatePowerCategory = z.infer<typeof updatePowerCategorySchema>;

export type CreatePowerAbility = Omit<PowerAbility, "id" | "createdAt" | "updatedAt">;
export type UpdatePowerAbility = z.infer<typeof updatePowerAbilitySchema>;

export type PowerSystemQueryParams = z.infer<typeof powerSystemQuerySchema>;
