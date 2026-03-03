import type { Request, Response } from "express";
import { paramsSchema } from "@/common/common.validation";
import { NotFoundError } from "@/common/error.types";
import type { CharacterService } from "@/entities/character/character.service";
import {
    createCharacterSchema,
    characterQuerySchema,
    updateCharacterSchema,
} from "@/entities/character/character.validation";
import {
    validateBody,
    validateParams,
    validateQuery,
} from "@/middleware/validation.middleware";
import log from "@/utils/logger";

export class CharacterController {
    private characterService: CharacterService;

    constructor(characterService: CharacterService) {
        this.characterService = characterService;
    }

    async createCharacter(req: Request, res: Response): Promise<void> {
        const characterData = validateBody(req.body, createCharacterSchema);
        const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
        const character = await this.characterService.createCharacter(characterData, files);

        log.info("Character created successfully", { characterId: character.id, operation: "create_character" });

        res.status(201).json({ success: true, data: character, message: "Character created successfully" });
    }

    async getCharacters(req: Request, res: Response): Promise<void> {
        const queryParams = validateQuery(req.query, characterQuerySchema);
        const result = await this.characterService.getCharacters(queryParams);

        log.info("Characters retrieved successfully", {
            count: result.data.length,
            totalItems: result.pagination.totalItems,
            currentPage: result.pagination.currentPage,
            operation: "get_characters",
        });

        res.status(200).json({ success: true, data: result.data, pagination: result.pagination, message: "Characters retrieved successfully" });
    }

    async getCharacterById(req: Request, res: Response): Promise<void> {
        const characterId = validateParams(req.params.id, paramsSchema);
        const character = await this.characterService.getCharacterById(characterId);

        if (!character) throw new NotFoundError("Character", characterId);

        res.status(200).json({ success: true, data: character, message: "Character retrieved successfully" });
    }

    async updateCharacter(req: Request, res: Response): Promise<void> {
        const characterId = validateParams(req.params.id, paramsSchema);
        const characterData = validateBody(req.body, updateCharacterSchema);
        const files = req.files && !Array.isArray(req.files) ? req.files : undefined;
        const character = await this.characterService.updateCharacter(characterId, characterData, files);

        log.info("Character updated successfully", { characterId: character.id, operation: "update_character" });

        res.status(200).json({ success: true, data: character, message: "Character updated successfully" });
    }

    async deleteCharacter(req: Request, res: Response): Promise<void> {
        const characterId = validateParams(req.params.id, paramsSchema);
        await this.characterService.deleteCharacter(characterId);

        log.info("Character deleted successfully", { characterId, operation: "delete_character" });

        res.status(200).json({ success: true, message: "Character deleted successfully" });
    }
}
