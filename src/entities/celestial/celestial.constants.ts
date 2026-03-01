// Sortable fields for each celestial body
export const sortableGalaxyFields = [
    "id",
    "name",
    "type",
    "createdAt",
    "updatedAt",
] as const;

export type SortableGalaxyField = (typeof sortableGalaxyFields)[number];

export const sortableSolarSystemFields = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
] as const;

export type SortableSolarSystemField = (typeof sortableSolarSystemFields)[number];

export const sortableStarFields = [
    "id",
    "name",
    "type",
    "createdAt",
    "updatedAt",
] as const;

export type SortableStarField = (typeof sortableStarFields)[number];

export const sortablePlanetFields = [
    "id",
    "name",
    "isHabitable",
    "createdAt",
    "updatedAt",
] as const;

export type SortablePlanetField = (typeof sortablePlanetFields)[number];
