// Sortable universe fields
export const sortableUniverseFields = [
  "id",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export type SortableUniverseField = (typeof sortableUniverseFields)[number];
