import type { z } from "zod";
import type { religions } from "./religion.schema";
import type {
  createReligionSchema,
  updateReligionSchema,
  religionQuerySchema,
} from "./religion.validation";
import type { Universe } from "@/entities/universe/universe.types";
import type { Region } from "@/entities/region/region.types";

export type Religion = typeof religions.$inferSelect;
export type CreateReligion = z.infer<typeof createReligionSchema>;
export type UpdateReligion = z.infer<typeof updateReligionSchema>;
export type ReligionQueryParams = z.infer<typeof religionQuerySchema>;

export interface ReligionWithRelations extends Religion {
  universe?: Universe;
  regions?: Region[];
}
