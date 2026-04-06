import { eventBus } from "@/common/events/event-bus";
import { demitreiService } from "./demitrei.service";
import { log } from "@/utils/logger";
import { CharacterService } from "@/entities/character/character.service";
import { CharacterRepository } from "@/entities/character/character.repository";
import { fileService } from "@/common/file/file.service";

// Instantiating a headless version of the Service so the 
// Subscriber can fetch data without needing to be tied to the Express router.
const characterService = new CharacterService(
    new CharacterRepository(),
    fileService
);

/**
 * Handles 'character.created' and 'character.updated' events
 */
const syncCharacterToAI = async (payload: { id: string }) => {
    try {
        const aiPayload = await characterService.getDemitreiPayload(payload.id);
        const syncResult = await demitreiService.syncEntity(aiPayload);

        if (!syncResult.success) {
            log.error("[Demitrei Subscriber] Sync failed", { error: syncResult.error.message });
        }
    } catch (error) {
        log.error("[Demitrei Subscriber] Failed to extract or map payload", { error: String(error) });
    }
};

/**
 * Handles 'character.deleted' events
 */
const removeCharacterFromAI = async (payload: { id: string }) => {
    try {
        const removeResult = await demitreiService.removeEntity(payload.id, "Character");

        if (!removeResult.success) {
            log.error("[Demitrei Subscriber] Removal failed", { error: removeResult.error.message });
        }
    } catch (error) {
        log.error("[Demitrei Subscriber] Deletion process crashed", { error: String(error) });
    }
};

eventBus.on("character.created", payload => { void syncCharacterToAI(payload); });
eventBus.on("character.updated", payload => { void syncCharacterToAI(payload); });
eventBus.on("character.deleted", payload => { void removeCharacterFromAI(payload); });

log.info("[Demitrei] Subscriber initialized & listening to EventBus.");
