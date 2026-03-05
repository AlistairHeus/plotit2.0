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
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerSubSystem {
  id: string;
  powerSystemId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerCategory {
  id: string;
  subSystemId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PowerAbility {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
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
  lastUsedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
