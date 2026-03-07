export const sortableCharacterFields = [
  "id",
  "name",
  "createdAt",
  "updatedAt",
] as const;

export const CHARACTER_TYPES = [
  "Protagonist",
  "Antagonist",
  "Supporting",
  "Minor",
  "Background",
] as const;

export type CharacterType = (typeof CHARACTER_TYPES)[number];

export const CHARACTER_GENDERS = ["Male", "Female", "Unspecified"] as const;

export type CharacterGender = (typeof CHARACTER_GENDERS)[number];

export type SortableCharacterField = (typeof sortableCharacterFields)[number];
