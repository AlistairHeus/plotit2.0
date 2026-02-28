export const GalaxyType = {
    SPIRAL: 'SPIRAL',
    BARRED_SPIRAL: 'BARRED_SPIRAL',
    ELLIPTICAL: 'ELLIPTICAL',
    IRREGULAR: 'IRREGULAR',
    LENTICULAR: 'LENTICULAR',
    RING: 'RING',
    DWARF: 'DWARF',
    QUASAR: 'QUASAR',
} as const;

export type GalaxyType = typeof GalaxyType[keyof typeof GalaxyType];

export const SpectralType = {
    HOT_BLUE_STAR: 'HOT_BLUE_STAR',
    BLUE_WHITE_STAR: 'BLUE_WHITE_STAR',
    WHITE_STAR: 'WHITE_STAR',
    YELLOW_WHITE_STAR: 'YELLOW_WHITE_STAR',
    YELLOW_STAR: 'YELLOW_STAR',
    ORANGE_STAR: 'ORANGE_STAR',
    RED_STAR: 'RED_STAR',
    LUMINOUS_RED_GIANT: 'LUMINOUS_RED_GIANT',
    SUPER_GIANT: 'SUPER_GIANT',
    WHITE_DWARF: 'WHITE_DWARF',
    NEUTRON_STAR: 'NEUTRON_STAR',
    BLACK_HOLE: 'BLACK_HOLE',
    UNKNOWN: 'UNKNOWN',
} as const;

export type SpectralType = typeof SpectralType[keyof typeof SpectralType];

export interface Galaxy {
    id: string;
    universeId: string;
    name: string;
    description: string | null;
    type: GalaxyType;
    color: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface SolarSystem {
    id: string;
    galaxyId: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Star {
    id: string;
    systemId: string;
    name: string;
    description: string | null;
    type: SpectralType;
    createdAt: Date;
    updatedAt: Date;
}

export interface Planet {
    id: string;
    systemId: string;
    parentId: string | null;
    name: string;
    description: string | null;
    color: string | null;
    isHabitable: boolean;
    createdAt: Date;
    updatedAt: Date;
}
