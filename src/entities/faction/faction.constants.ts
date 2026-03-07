// Sortable faction fields
export const sortableFactionFields = [
  "id",
  "name",
  "type",
  "createdAt",
  "updatedAt",
] as const;

export type SortableFactionField = (typeof sortableFactionFields)[number];
