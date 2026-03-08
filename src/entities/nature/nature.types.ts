import { z } from "zod";
import type { Universe } from "@/entities/universe/universe.types";
import {
  createNatureSchema,
  natureQuerySchema,
  updateNatureSchema,
} from "@/entities/nature/nature.validation";

export type NatureType = "PLANT" | "ANIMAL" | "MINERAL";
export const NatureType = {
  PLANT: "PLANT",
  ANIMAL: "ANIMAL",
  MINERAL: "MINERAL",
} as const;

export interface Nature {
  id: string;
  name: string;
  description: string | null;
  type: NatureType;
  universeId: string;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl: string | null;
  imageUrls: string[];
}

export interface NatureWithRelations extends Nature {
  universe?: Universe | null;
}

export type CreateNature = z.infer<typeof createNatureSchema>;
export type UpdateNature = z.infer<typeof updateNatureSchema>;
export type NatureQueryParams = z.infer<typeof natureQuerySchema>;
