export const sortableRaceFields = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
] as const;

export type SortableRaceField = (typeof sortableRaceFields)[number];
