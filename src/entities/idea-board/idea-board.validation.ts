import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import { sortableIdeaBoardFields } from "@/entities/idea-board/idea-board.constants";

export const createIdeaBoardSchema = z.object({
  name: z.string().min(1),
  universeId: z.string().uuid(),
  description: z.string().nullable().optional(),
  elements: z.array(z.any()).optional().default([]),
  appState: z.record(z.any()).optional().default({}),
  files: z.record(z.any()).optional().default({}),
});

export const updateIdeaBoardSchema = createIdeaBoardSchema
  .partial()
  .omit({ universeId: true });

export const ideaBoardQuerySchema = createPaginatedQuerySchema(
  sortableIdeaBoardFields,
  "updatedAt",
  {
    name: z.string().optional(),
    universeId: z.string().uuid().optional(),
  },
);
