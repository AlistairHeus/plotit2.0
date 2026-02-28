export enum ConstructCategory {
  AFFLICTIONS = "AFFLICTIONS",
  MANIFESTATIONS = "MANIFESTATIONS",
  ENTITIES = "ENTITIES",
  VESTIGES = "VESTIGES",
}

export interface Construct {
  id: string;
  name: string;
  description: string | null;
  category: ConstructCategory;
  universeId: string;
  createdAt: Date;
  updatedAt: Date;
  properties: Record<string, unknown> | null;
  rarity: string | null;
  tags: string[];
  avatarUrl: string | null;
  imageUrls: string[];
}
