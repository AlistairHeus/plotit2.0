import type { Universe } from "@/entities/universe/universe.types";
import {
  updateIdeaBoardSchema,
  ideaBoardQuerySchema,
} from "./idea-board.validation";
import { z } from "zod";

export interface IdeaBoard {
  id: string;
  universeId: string;
  name: string;
  description?: string | null | undefined;
  elements: unknown;
  appState: unknown;
  files: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export type IdeaBoardWithRelations = IdeaBoard & {
  universe: Universe;
};

export type CreateIdeaBoard = Omit<
  IdeaBoard,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateIdeaBoard = z.infer<typeof updateIdeaBoardSchema>;

export type IdeaBoardQueryParams = z.infer<typeof ideaBoardQuerySchema>;
