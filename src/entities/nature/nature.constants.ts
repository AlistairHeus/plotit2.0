// Sortable nature fields
export const sortableNatureFields = [
  "id",
  "name",
  "type",
  "createdAt",
  "updatedAt",
] as const;

export type SortableNatureField = (typeof sortableNatureFields)[number];
