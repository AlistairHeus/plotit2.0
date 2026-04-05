import type { Result } from "@/common/common.types";
import { log } from "@/utils/logger";
import type { DemitreiPayload } from "./demitrei.types";
import { demitreiApiClient, type DemitreiApiClient } from "./demitrei.client";

export class DemitreiService {
    private readonly client: DemitreiApiClient;

    constructor(client: DemitreiApiClient = demitreiApiClient) {
        this.client = client;
    }

    /**
     * Sends a hydrated entity payload to Demitrei for ingestion.
     * @param payload - The semantic payload (Character, Planet, etc.)
     */
    async syncEntity(payload: DemitreiPayload): Promise<Result<void>> {
        try {
            log.info(`[Demitrei] Syncing ${payload.type}`, {
                id: payload.id,
                name: payload.name
            });

            await this.client.post("/ingest/entity", payload);

            return { success: true, data: undefined };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            log.error(`[Demitrei] Failed to sync ${payload.type}`, {
                id: payload.id,
                error: errorMessage,
            });

            return {
                success: false,
                error: error instanceof Error ? error : new Error(errorMessage),
            };
        }
    }

    /**
     * Removes an entity from the Demitrei AI context.
     * Useful when an entity is deleted from the primary database (Postgres).
     * @param id - The ID of the entity to remove
     * @param type - The type of the entity
     */
    async removeEntity(
        id: string,
        type: DemitreiPayload["type"]
    ): Promise<Result<void>> {
        try {
            log.info(`[Demitrei] Removing ${type}`, { id });

            // Assuming Demitrei follows a standard REST pattern for deletions
            await this.client.delete(`/ingest/entity/${type.toLowerCase()}/${id}`);

            return { success: true, data: undefined };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            log.error(`[Demitrei] Failed to remove ${type}`, {
                id,
                error: errorMessage,
            });

            return {
                success: false,
                error: error instanceof Error ? error : new Error(errorMessage),
            };
        }
    }
}

export const demitreiService = new DemitreiService();
