import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortablePowerSystemFields } from "@/entities/power-system/power-system.constants";

export const createPowerSystemSchema = z.object({
  name: z.string().min(1),
  rootOfPowerId: z.string().uuid(),
  description: z.string().nullable().optional(),
});

export const updatePowerSystemSchema = createPowerSystemSchema
  .partial()
  .omit({ rootOfPowerId: true });

// --- rootsOfPower ---
export const createRootOfPowerSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  description: z.string().nullable().optional(),
});
export const updateRootOfPowerSchema = createRootOfPowerSchema
  .partial()
  .omit({ universeId: true });

// --- powerSubSystems ---
export const createPowerSubSystemSchema = z.object({
  name: z.string().min(1),
  powerSystemId: z.string().uuid(),
  description: z.string().nullable().optional(),
});
export const updatePowerSubSystemSchema = createPowerSubSystemSchema
  .partial()
  .omit({ powerSystemId: true });

// --- powerCategories ---
export const createPowerCategorySchema = z.object({
  name: z.string().min(1),
  powerSystemId: z.string().uuid().nullable().optional(),
  subSystemId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
});
export const updatePowerCategorySchema = createPowerCategorySchema.partial();

// --- powerAbilities ---
export const createPowerAbilitySchema = z.object({
  name: z.string().min(1),
  powerSystemId: z.string().uuid().nullable().optional(),
  subSystemId: z.string().uuid().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional(),
  description: z.string().nullable().optional(),
});
export const updatePowerAbilitySchema = createPowerAbilitySchema.partial();

export const powerSystemQuerySchema = createPaginatedQuerySchema(
  sortablePowerSystemFields,
  "updatedAt",
  {
    name: z.string().optional(),
    rootOfPowerId: z.string().uuid().optional(),
  },
);
