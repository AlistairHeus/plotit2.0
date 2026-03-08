// Sortable nature fields
export const sortableNatureFields = [
  "id",
  "name",
  "type",
  "occurance",
  "createdAt",
  "updatedAt",
] as const;

export type SortableNatureField = (typeof sortableNatureFields)[number];
