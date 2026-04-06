export interface PlotItEvents {
    // Character Entity Lifecycle
    "character.created": { id: string };
    "character.updated": { id: string };
    "character.deleted": { id: string };

    // Placeholder for future entities
    // "planet.created": { id: string };
};
