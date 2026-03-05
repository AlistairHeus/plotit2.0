export const sortablePowerSystemFields = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
] as const;

export type SortablePowerSystemField = (typeof sortablePowerSystemFields)[number];
