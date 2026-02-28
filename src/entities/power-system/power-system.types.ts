export interface RootOfPower {
    id: string;
    universeId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PowerSystem {
    id: string;
    rootOfPowerId: string;
    name: string;
    description: string | null;
    rank: number;
    rules: string | null;
    isActive: boolean;
    icon: string | null;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PowerSubSystem {
    id: string;
    powerSystemId: string;
    name: string;
    description: string | null;
    rank: number;
    isActive: boolean;
    requirements: any | null;
    icon: string | null;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PowerCategory {
    id: string;
    subSystemId: string;
    name: string;
    description: string | null;
    rank: number;
    isActive: boolean;
    requirements: any | null;
    icon: string | null;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PowerAbility {
    id: string;
    categoryId: string;
    name: string;
    description: string | null;
    rank: number;
    isActive: boolean;
    requirements: any | null;
    icon: string | null;
    color: string | null;
    cooldown: number | null;
    manaCost: number | null;
    damage: any | null;
    effects: any | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CharacterPowerAccess {
    id: string;
    characterId: string;
    powerSystemId: string | null;
    subSystemId: string | null;
    categoryId: string | null;
    abilityId: string | null;
    accessLevel: number;
    masteryPoints: number;
    isActive: boolean;
    unlockedAt: Date;
    lastUsedAt: Date | null;
    usageCount: number;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
