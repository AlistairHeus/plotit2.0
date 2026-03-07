// Sortable construct fields
export const sortableConstructFields = [
  "id",
  "name",
  "category",
  "createdAt",
  "updatedAt",
] as const;

export type SortableConstructField = (typeof sortableConstructFields)[number];
