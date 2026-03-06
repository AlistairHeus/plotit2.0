import { z } from "zod";
import { createPaginatedQuerySchema, zodFormArray, zodFormBoolean, zodFormUUID, zodFormString } from "@/common/validation.utils";
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
    avatarUrl: zodFormString(z.string().url().nullable().optional()),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateGalaxySchema = createGalaxySchema
    .partial()
    .omit({ universeId: true });

export const galaxyQuerySchema = createPaginatedQuerySchema(
    sortableGalaxyFields,
    "createdAt",
    {
        universeId: zodFormUUID(z.string().uuid().optional()),
        name: z.string().optional(),
        type: z.nativeEnum(GalaxyType).optional(),
    }
);

// --- SOLAR SYSTEM ---
export const createSolarSystemSchema = z.object({
    galaxyId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    avatarUrl: zodFormString(z.string().url().nullable().optional()),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateSolarSystemSchema = createSolarSystemSchema
    .partial()
    .omit({ galaxyId: true });

export const solarSystemQuerySchema = createPaginatedQuerySchema(
    sortableSolarSystemFields,
    "createdAt",
    {
        galaxyId: zodFormUUID(z.string().uuid().optional()),
        name: z.string().optional(),
    }
);

// --- STAR ---
export const createStarSchema = z.object({
    systemId: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    type: z.nativeEnum(SpectralType).optional(),
    avatarUrl: zodFormString(z.string().url().nullable().optional()),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updateStarSchema = createStarSchema
    .partial()
    .omit({ systemId: true });

export const starQuerySchema = createPaginatedQuerySchema(
    sortableStarFields,
    "createdAt",
    {
        systemId: zodFormUUID(z.string().uuid().optional()),
        name: z.string().optional(),
        type: z.nativeEnum(SpectralType).optional(),
    }
);

// --- PLANET ---
export const createPlanetSchema = z.object({
    systemId: z.string().uuid(),
    parentPlanetId: zodFormUUID(z.string().uuid().nullable().optional()),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    isHabitable: zodFormBoolean(z.boolean().optional()),
    avatarUrl: zodFormString(z.string().url().nullable().optional()),
    imageUrls: zodFormArray(z.array(z.string().url())).optional(),
});

export const updatePlanetSchema = createPlanetSchema
    .partial()
    .omit({ systemId: true });

export const planetQuerySchema = createPaginatedQuerySchema(
    sortablePlanetFields,
    "createdAt",
    {
        universeId: zodFormUUID(z.string().uuid().optional()),
        systemId: zodFormUUID(z.string().uuid().optional()),
        parentPlanetId: zodFormUUID(z.string().uuid().optional()),
        name: z.string().optional(),
        isHabitable: zodFormBoolean(z.boolean().optional()),
    }
);
