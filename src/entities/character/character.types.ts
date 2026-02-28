export interface Character {
    id: string;
    universeId: string;
    raceId: string | null;
    ethnicGroupId: string | null;
    name: string;
    background: string | null;
    type: string | null;
    gender: string | null;
    age: number | null;
    colorCode: string | null;
    avatarUrl: string | null;
    imageUrls: string[];
    benched: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface CreateCharacterRequest {
    name: string;
    universeId: string;
    raceId?: string;
    ethnicGroupId?: string;
    background?: string;
    type?: string;
    gender?: string;
    age?: number;
    colorCode?: string;
    avatarUrl?: string;
    imageUrls?: string[];
}
