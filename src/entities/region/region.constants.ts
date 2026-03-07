// Sortable region fields
export const sortableRegionFields = [
  "id",
  "name",
  "type",
  "createdAt",
  "updatedAt",
] as const;

export type SortableRegionField = (typeof sortableRegionFields)[number];
