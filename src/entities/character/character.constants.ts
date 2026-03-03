export const sortableCharacterFields = [
    "id",
    "name",
    "createdAt",
    "updatedAt",
] as const;

export type SortableCharacterField = (typeof sortableCharacterFields)[number];
