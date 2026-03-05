export interface Religion {
  id: string;
  universeId: string;
  name: string;
  description: string | null;
  deities: string[];
  holySites: string[];
  avatarUrl: string | null;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}
