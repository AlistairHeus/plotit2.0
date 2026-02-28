export interface Race {
  id: string;
  universeId: string;
  name: string;
  description: string | null;
  lifespan: string | null;
  languages: string[] | null;
  origins: string | null;
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface EthnicGroup {
  id: string;
  raceId: string;
  name: string;
  description: string | null;
  physicalCharacteristics: string[] | null;
  culturalTraits: string[] | null;
  regionalAdaptations: string[] | null;
  climateInfluences: string[] | null;
  languages: string[] | null;
  geographicOrigin: string | null;
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
