import { z } from "zod";
import type { Universe } from "@/entities/universe/universe.types";
import {
  createConstructSchema,
  constructQuerySchema,
  updateConstructSchema,
} from "@/entities/construct/construct.validation";

export type ConstructCategory = "AFFLICTIONS" | "MANIFESTATIONS" | "ENTITIES" | "VESTIGES";
export const ConstructCategory = {
  AFFLICTIONS: "AFFLICTIONS",
  MANIFESTATIONS: "MANIFESTATIONS",
  ENTITIES: "ENTITIES",
  VESTIGES: "VESTIGES",
} as const;

export interface Construct {
  id: string;
  name: string;
  description: string | null;
  category: ConstructCategory;
  universeId: string;
  createdAt: Date;
  updatedAt: Date;
  properties: unknown;
  rarity: string | null;
  tags: string[];
  avatarUrl: string | null;
  imageUrls: string[];
}

export interface ConstructWithRelations extends Construct {
  universe?: Universe | null;
}

export type CreateConstruct = z.infer<typeof createConstructSchema>;
export type UpdateConstruct = z.infer<typeof updateConstructSchema>;
export type ConstructQueryParams = z.infer<typeof constructQuerySchema>;
