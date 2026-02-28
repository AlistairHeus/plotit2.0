import pkg from 'pg';
const { Client } = pkg;
import { db } from './connection.js';
import {
    universes,
    galaxies,
    solarSystems,
    stars,
    planets,
    characters,
    constructs,
    maps,
    gridCells,
    mapRegions,
    gridCellFeatures,
    regionSvgMappings,
    rootsOfPower,
    powerSystems,
    powerSubSystems,
    powerCategories,
    powerAbilities,
    characterPowerAccess,
    races,
    ethnicGroups,
    regions,
    religions,
} from './schema/index.js';
import { users } from '../entities/user/user.schema.js';

import { eq } from 'drizzle-orm';

async function migrate() {
    const client = new Client('postgresql://postgres:alistairheus@localhost:5432/plotitdatabase1');
    await client.connect();
    console.log('Connected to V1 database.');

    try {
        // 1. Users
        console.log('Migrating users...');
        const v1Users = await client.query('SELECT * FROM users');
        const userIdMap: Record<string, string> = {};

        if (v1Users.rows.length > 0) {
            for (const row of v1Users.rows) {
                // Check if user already exists
                const existingUser = await db.select().from(users).where(eq(users.email, row.email)).limit(1);

                if (existingUser.length > 0) {
                    userIdMap[row.id] = existingUser[0].id;
                } else {
                    const usersData = {
                        id: row.id,
                        email: row.email,
                        firstName: row.name ? row.name.split(' ')[0] : 'Unknown',
                        lastName: row.name && row.name.split(' ').length > 1 ? row.name.split(' ').slice(1).join(' ') : 'Unknown',
                        password: row.password,
                        createdAt: row.created_at,
                        updatedAt: row.updated_at,
                    };
                    await db.insert(users).values(usersData).onConflictDoNothing();
                    userIdMap[row.id] = row.id;
                }
            }
        }

        // 2. Universes
        console.log('Migrating universes...');
        const v1Universes = await client.query('SELECT * FROM universes');
        if (v1Universes.rows.length > 0) {
            const universesData = v1Universes.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                userId: userIdMap[row.user_id] || row.user_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
            await db.insert(universes).values(universesData).onConflictDoNothing();
        }


        // 3. Religions
        console.log('Migrating religions...');
        const v1Religions = await client.query('SELECT * FROM religions');
        if (v1Religions.rows.length > 0) {
            const religionsData = v1Religions.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                universeId: row.universe_id,
                deities: row.deities,
                tenets: row.tenets,
                practices: row.practices,
                holySites: row.holy_sites,
                avatarUrl: row.avatar_url,
                imageUrls: row.image_urls,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
            await db.insert(religions).values(religionsData).onConflictDoNothing();
        }

        // 4. Roots of Power, Power Systems, etc.
        console.log('Migrating Power Systems...');
        const v1Roots = await client.query('SELECT * FROM root_of_power');
        if (v1Roots.rows.length > 0) {
            await db.insert(rootsOfPower).values(v1Roots.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                universeId: row.universe_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1PowerSystems = await client.query('SELECT * FROM power_systems');
        if (v1PowerSystems.rows.length > 0) {
            await db.insert(powerSystems).values(v1PowerSystems.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                rootOfPowerId: row.root_of_power_id,
                rank: row.rank,
                rules: row.rules,
                isActive: row.isActive,
                icon: row.icon,
                color: row.color,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1PowerSubsystems = await client.query('SELECT * FROM power_subsystems');
        if (v1PowerSubsystems.rows.length > 0) {
            await db.insert(powerSubSystems).values(v1PowerSubsystems.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                powerSystemId: row.power_system_id,
                rank: row.rank,
                isActive: row.isActive,
                icon: row.icon,
                color: row.color,
                requirements: row.requirements,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1PowerCategories = await client.query('SELECT * FROM power_categories');
        if (v1PowerCategories.rows.length > 0) {
            await db.insert(powerCategories).values(v1PowerCategories.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                subSystemId: row.subsystem_id,
                rank: row.rank,
                isActive: row.isActive,
                icon: row.icon,
                color: row.color,
                requirements: row.requirements,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1PowerAbilities = await client.query('SELECT * FROM power_abilities');
        if (v1PowerAbilities.rows.length > 0) {
            await db.insert(powerAbilities).values(v1PowerAbilities.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                categoryId: row.category_id,
                rank: row.rank,
                isActive: row.isActive,
                icon: row.icon,
                color: row.color,
                requirements: row.requirements,
                cooldown: row.cooldown,
                manaCost: row.manaCost,
                damage: row.damage,
                effects: row.effects,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        // 5. Races and Ethnic Groups
        console.log('Migrating Races...');
        const v1Races = await client.query('SELECT * FROM races');
        if (v1Races.rows.length > 0) {
            await db.insert(races).values(v1Races.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                universeId: row.universe_id,
                lifespan: row.lifespan,
                languages: row.languages,
                origins: row.origins,
                avatarUrl: row.avatar_url,
                imageUrls: row.image_urls,
                createdAt: row.createdAt, // Notice the case match from V1 data mapping? V1 used `createdAt` for this table? Actually let's just coalesce
                updatedAt: row.updatedAt || new Date(),
                deletedAt: row.deletedAt,
            }))).onConflictDoNothing();
        }

        const v1Ethnic = await client.query('SELECT * FROM ethnic_groups');
        if (v1Ethnic.rows.length > 0) {
            await db.insert(ethnicGroups).values(v1Ethnic.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                raceId: row.race_id,
                physicalCharacteristics: row.physicalCharacteristics,
                culturalTraits: row.culturalTraits,
                regionalAdaptations: row.regionalAdaptations,
                climateInfluences: row.climateInfluences,
                languages: row.languages,
                geographicOrigin: row.geographicOrigin,
                avatarUrl: row.avatar_url,
                imageUrls: row.image_urls || [],
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        // 6. Characters
        console.log('Migrating characters...');
        const v1Characters = await client.query('SELECT * FROM characters');
        if (v1Characters.rows.length > 0) {
            const charsData = v1Characters.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                universeId: row.universe_id,
                raceId: row.race_id || null,
                ethnicGroupId: row.ethnic_group_id || null,
                background: row.background,
                type: row.type,
                gender: row.gender,
                age: row.age,
                colorCode: row.colorCode,
                avatarUrl: row.avatar_url,
                imageUrls: row.image_urls || [],
                benched: row.benched || false,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                deletedAt: row.deleted_at,
            }));
            await db.insert(characters).values(charsData).onConflictDoNothing();
        }

        // 7. Celestials
        console.log('Migrating Celestials...');
        const v1Galaxies = await client.query('SELECT * FROM galaxies');
        if (v1Galaxies.rows.length > 0) {
            await db.insert(galaxies).values(v1Galaxies.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                universeId: row.universe_id,
                type: row.type as any, // Enum mapping handles correctly usually
                color: row.color,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1Systems = await client.query('SELECT * FROM solar_systems');
        if (v1Systems.rows.length > 0) {
            await db.insert(solarSystems).values(v1Systems.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                galaxyId: row.galaxy_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1Stars = await client.query('SELECT * FROM stars');
        if (v1Stars.rows.length > 0) {
            await db.insert(stars).values(v1Stars.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                systemId: row.solar_system_id, // Fix
                type: row.spectralType as any,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1Planets = await client.query('SELECT * FROM planets');
        if (v1Planets.rows.length > 0) {
            await db.insert(planets).values(v1Planets.rows.map(row => ({
                id: row.id,
                name: row.name,
                description: row.description,
                systemId: row.solar_system_id,
                color: row.color,
                isHabitable: row.habitabilityIndex > 0.5 ? true : false,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        // 8. Constructs
        console.log('Migrating constructs...');
        const v1Constructs = await client.query('SELECT * FROM constructs');
        if (v1Constructs.rows.length > 0) {
            const constructData = v1Constructs.rows.map((row: any) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                universeId: row.universe_id,
                category: row.category as any,
                properties: row.properties,
                rarity: row.rarity,
                tags: row.tags || [],
                avatarUrl: row.avatar_url,
                imageUrls: row.image_urls || [],
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }));
            await db.insert(constructs).values(constructData).onConflictDoNothing();
        }

        // 9. Regions
        console.log('Migrating regions...');
        const v1Regions = await client.query('SELECT * FROM regions');
        if (v1Regions.rows.length > 0) {
            await db.insert(regions).values(v1Regions.rows.map((row) => ({
                id: row.id,
                name: row.name,
                description: row.description,
                universeId: row.universe_id,
                parentId: row.parent_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
                type: row.type as any,
                features: Array.isArray(row.features) ? row.features : [],
                planetId: row.planet_id,
                area: row.area,
                boundaries: row.boundaries,
                capital: row.capital,
                coastlineLength: row.coastlineLength,
                coordinates: row.coordinates,
                culture: row.culture,
                elevation: row.elevation,
                government: row.government,
                language: Array.isArray(row.language) ? row.language : [],
                population: row.population,
                religionId: row.religion_id,
                rainfall: row.rainfall,
                temperature: row.temperature,
                waterBodies: row.waterBodies,
                climate: row.climate as any,
                resources: Array.isArray(row.resources) ? row.resources : [],
                avatarUrl: row.avatar_url,
                imageUrls: Array.isArray(row.image_urls) ? row.image_urls : [],
            }))).onConflictDoNothing();
        }

        // 10. Maps
        console.log('Migrating maps...');
        const v1Maps = await client.query('SELECT * FROM maps');
        if (v1Maps.rows.length > 0) {
            await db.insert(maps).values(v1Maps.rows.map((row) => ({
                id: row.id,
                name: row.name,
                universeId: row.universe_id,
                regionId: row.region_id,
                imageUrl: row.image_url,
                gridEnabled: row.grid_enabled,
                gridSize: row.grid_size,
                gridScale: row.grid_scale,
                svgContent: row.svg_content,
                viewBox: row.view_box,
                gridHeight: row.grid_height,
                gridHexHeight: row.grid_hex_height,
                gridHexWidth: row.grid_hex_width,
                gridHorizontalSpacing: row.grid_horizontal_spacing,
                gridVerticalSpacing: row.grid_vertical_spacing,
                gridWidth: row.grid_width,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        const v1GridCells = await client.query('SELECT * FROM grid_cells');
        if (v1GridCells.rows.length > 0) {
            await db.insert(gridCells).values(v1GridCells.rows.map(row => ({
                id: row.id,
                mapId: row.map_id,
                row: row.row,
                col: row.col,
                regionId: row.region_id,
                terrainType: row.terrainType || row.terrain_type,
                featureType: row.featureType || row.feature_type,
                elevation: row.elevation,
                pathData: row.path_data,
            }))).onConflictDoNothing();
        }

        const v1RegionSvgMappings = await client.query('SELECT * FROM region_svg_mappings');
        if (v1RegionSvgMappings.rows.length > 0) {
            await db.insert(regionSvgMappings).values(v1RegionSvgMappings.rows.map((row) => ({
                id: row.id,
                mapId: row.map_id,
                regionId: row.region_id,
                svgStateId: row.svg_state_id,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        // 11. Character Power Access
        console.log('Migrating character power access...');
        const v1CPA = await client.query('SELECT * FROM character_power_access');
        if (v1CPA.rows.length > 0) {
            await db.insert(characterPowerAccess).values(v1CPA.rows.map((row) => ({
                id: row.id,
                characterId: row.character_id,
                powerSystemId: row.power_system_id,
                subSystemId: row.subsystem_id,
                categoryId: row.category_id,
                abilityId: row.ability_id,
                accessLevel: row.accessLevel || row.access_level,
                masteryPoints: row.masteryPoints || row.mastery_points,
                isActive: row.isActive || row.is_active,
                unlockedAt: row.unlockedAt || row.unlocked_at,
                lastUsedAt: row.lastUsedAt || row.last_used_at,
                usageCount: row.usageCount || row.usage_count,
                notes: row.notes,
                createdAt: row.created_at,
                updatedAt: row.updated_at,
            }))).onConflictDoNothing();
        }

        console.log('Migration complete!');

    } catch (err) {
        console.error('Migration failed', err);
    } finally {
        await client.end();
        process.exit(0);
    }
}

migrate();
