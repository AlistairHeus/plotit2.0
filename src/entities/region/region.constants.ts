// Sortable region fields
export const sortableRegionFields = [
    "id",
    "name",
    "type",
    "area",
    "population",
    "elevation",
    "rainfall",
    "temperature",
    "createdAt",
    "updatedAt",
] as const;

export type SortableRegionField = (typeof sortableRegionFields)[number];
