export interface Religion {
  id: string;
  universeId: string;
  name: string;
  description: string | null;
  deities: string[];
  tenets: string[];
  practices: string[];
  holySites: string[];
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
