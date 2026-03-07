// Sortable religion fields
export const sortableReligionFields = [
  "id",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export type SortableReligionField = (typeof sortableReligionFields)[number];
