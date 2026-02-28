export interface Universe {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUniverseRequest {
  name: string;
  description?: string;
}

export interface UpdateUniverseRequest {
  name?: string;
  description?: string;
}

export interface UniverseQuery {
  name?: string;
  userId?: string;
  page?: number;
  limit?: number;
}
