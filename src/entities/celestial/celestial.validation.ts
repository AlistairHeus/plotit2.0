import { z } from "zod";
import { createPaginatedQuerySchema } from "@/common/validation.utils";
import {
    sortableGalaxyFields,
    sortableSolarSystemFields,
    sortableStarFields,
    sortablePlanetFields
} from "@/entities/celestial/celestial.constants";
import { GalaxyType, SpectralType } from "@/entities/celestial/celestial.types";

// --- GALAXY ---
export const createGalaxySchema = z.object({
    universeId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    type: z.nativeEnum(GalaxyType).optional(),
    avatarUrl: z.string().nullable().optional(),
    imageUrls: z.preprocess(
        (val) => {
            if (!val) return undefined;
            if (typeof val === "string") return [val];
            return val;
        },
        z.array(z.string()).nullable().optional()
    ),
});

export const updateGalaxySchema = createGalaxySchema
    .partial()
    .omit({ universeId: true });

export const galaxyQuerySchema = createPaginatedQuerySchema(
    sortableGalaxyFields,
    "createdAt",
    {
        universeId: z.string().uuid().optional(),
        name: z.string().optional(),
        type: z.nativeEnum(GalaxyType).optional(),
    }
);

// --- SOLAR SYSTEM ---
export const createSolarSystemSchema = z.object({
    galaxyId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    avatarUrl: z.string().nullable().optional(),
    imageUrls: z.preprocess(
        (val) => {
            if (!val) return undefined;
            if (typeof val === "string") return [val];
            return val;
        },
        z.array(z.string()).nullable().optional()
    ),
});

export const updateSolarSystemSchema = createSolarSystemSchema
    .partial()
    .omit({ galaxyId: true });

export const solarSystemQuerySchema = createPaginatedQuerySchema(
    sortableSolarSystemFields,
    "createdAt",
    {
        galaxyId: z.string().uuid().optional(),
        name: z.string().optional(),
    }
);

// --- STAR ---
export const createStarSchema = z.object({
    systemId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    type: z.nativeEnum(SpectralType).optional(),
    avatarUrl: z.string().nullable().optional(),
    imageUrls: z.preprocess(
        (val) => {
            if (!val) return undefined;
            if (typeof val === "string") return [val];
            return val;
        },
        z.array(z.string()).nullable().optional()
    ),
});

export const updateStarSchema = createStarSchema
    .partial()
    .omit({ systemId: true });

export const starQuerySchema = createPaginatedQuerySchema(
    sortableStarFields,
    "createdAt",
    {
        systemId: z.string().uuid().optional(),
        name: z.string().optional(),
        type: z.nativeEnum(SpectralType).optional(),
    }
);

// --- PLANET ---
export const createPlanetSchema = z.object({
    systemId: z.string().uuid(),
    parentPlanetId: z.string().uuid().nullable().optional(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    isHabitable: z.preprocess((val) => {
        if (typeof val === 'string') {
            if (val.toLowerCase() === 'true') return true;
            if (val.toLowerCase() === 'false') return false;
        }
        return val;
    }, z.boolean().optional()),
    avatarUrl: z.string().nullable().optional(),
    imageUrls: z.preprocess(
        (val) => {
            if (!val) return undefined;
            if (typeof val === "string") return [val];
            return val;
        },
        z.array(z.string()).nullable().optional()
    ),
});

export const updatePlanetSchema = createPlanetSchema
    .partial()
    .omit({ systemId: true });

export const planetQuerySchema = createPaginatedQuerySchema(
    sortablePlanetFields,
    "createdAt",
    {
        universeId: z.string().uuid().optional(),
        systemId: z.string().uuid().optional(),
        parentPlanetId: z.string().uuid().optional(),
        name: z.string().optional(),
        isHabitable: z.boolean().optional(),
        // Note: query schema converts strings to booleans if needed, 
        // but typically express query parser might need a refine if strict
    }
);
