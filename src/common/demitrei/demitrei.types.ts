import type { Character } from "@/entities/character/character.types";

type DemitreiNoise =
    | "id"
    | "createdAt"
    | "updatedAt"
    | "deletedAt"
    | "avatarUrl"
    | "imageUrls"
    | "name"
    | "description"
    | "background";


export type CharacterMetadata =
    Omit<Character, DemitreiNoise | "universeId" | "raceId" | "ethnicGroupId"> & {
        universe: string;
        race: string | null;
        ethnicGroup: string | null;
    };

export interface CharacterPayload {
    id: string;
    type: "Character";
    name: string;
    content: string;
    metadata: CharacterMetadata;
}

/**
 * THE MASTER UNION
 * This allows the DemitreiService to handle any entity 
 * through a single post method.
 */
export type DemitreiPayload = CharacterPayload; // | PlanetPayload | FactionPayload ...
