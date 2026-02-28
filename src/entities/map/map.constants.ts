export const sortableMapFields = [
    "id",
    "name",
    "universeId",
    "regionId",
    "createdAt",
    "updatedAt",
] as const;

export type SortableMapField = (typeof sortableMapFields)[number];
