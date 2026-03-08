import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { FactionService } from "@/entities/faction/faction.service";
import {
  createFactionSchema,
  updateFactionSchema,
  factionQuerySchema,
  createRelationshipSchema,
  updateRelationshipSchema,
  relationshipQuerySchema,
} from "@/entities/faction/faction.validation";
import { validateBody, validateParams, validateQuery } from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class FactionController {
  private factionService: FactionService;

  constructor(factionService: FactionService) {
    this.factionService = factionService;
  }

  // ── Factions ────────────────────────────────────────────────────────────────

  async createFaction(req: Request, res: Response): Promise<void> {
    const data = validateBody(req.body, createFactionSchema);
    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
    const faction = await this.factionService.createFaction(data, files);
    log.info("Faction created", { factionId: faction.id });
    res.status(201).json({ success: true, data: faction, message: "Faction created successfully" });
  }

  async getFactions(req: Request, res: Response): Promise<void> {
    const query = validateQuery(req.query, factionQuerySchema);
    const result = await this.factionService.getFactions(query);
    res.status(200).json({ success: true, data: result.data, pagination: result.pagination });
  }

  async getFactionById(req: Request, res: Response): Promise<void> {
    const id = validateParams(req.params.id, paramsSchema);
    const faction = await this.factionService.getFactionById(id);
    if (!faction) throw new NotFoundError("Faction", id);
    res.status(200).json({ success: true, data: faction });
  }

  async updateFaction(req: Request, res: Response): Promise<void> {
    const id = validateParams(req.params.id, paramsSchema);
    const data = validateBody(req.body, updateFactionSchema);
    const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
    const faction = await this.factionService.updateFaction(id, data, files);
    res.status(200).json({ success: true, data: faction, message: "Faction updated successfully" });
  }

  async deleteFaction(req: Request, res: Response): Promise<void> {
    const id = validateParams(req.params.id, paramsSchema);
    await this.factionService.deleteFaction(id);
    res.status(200).json({ success: true, message: "Faction deleted successfully" });
  }

  // ── Character Relationships ───────────────────────────────────────────────────

  async getRelationships(req: Request, res: Response): Promise<void> {
    const query = validateQuery(req.query, relationshipQuerySchema);
    const relationships = await this.factionService.getRelationships(query);
    res.status(200).json({ success: true, data: relationships });
  }

  async createRelationship(req: Request, res: Response): Promise<void> {
    const data = validateBody(req.body, createRelationshipSchema);
    const relationship = await this.factionService.createRelationship(data);
    log.info("Character relationship created", { id: relationship.id, type: relationship.type });
    res.status(201).json({ success: true, data: relationship, message: "Relationship created successfully" });
  }

  async updateRelationship(req: Request, res: Response): Promise<void> {
    const id = validateParams(req.params.id, paramsSchema);
    const data = validateBody(req.body, updateRelationshipSchema);
    const relationship = await this.factionService.updateRelationship(id, data);
    res.status(200).json({ success: true, data: relationship, message: "Relationship updated successfully" });
  }

  async deleteRelationship(req: Request, res: Response): Promise<void> {
    const id = validateParams(req.params.id, paramsSchema);
    await this.factionService.deleteRelationship(id);
    res.status(200).json({ success: true, message: "Relationship deleted successfully" });
  }
}
