import {
  galaxies,
  galaxiesRelations,
  galaxyTypeEnum,
  planets,
  planetsRelations,
  solarSystems,
  solarSystemsRelations,
  spectralTypeEnum,
  stars,
  starsRelations,
} from "@/entities/celestial/celestial.schema";
import {
  characters,
  charactersRelations,
} from "@/entities/character/character.schema";
import {
  constructCategoryEnum,
  constructs,
  constructsRelations,
} from "@/entities/construct/construct.schema";
import { maps, mapsRelations } from "@/entities/map/map.schema";
import {
  characterPowerAccess,
  characterPowerAccessRelations,
  powerAbilities,
  powerAbilitiesRelations,
  powerCategories,
  powerCategoriesRelations,
  powerSubSystems,
  powerSubSystemsRelations,
  powerSystems,
  powerSystemsRelations,
  rootsOfPower,
  rootsOfPowerRelations,
} from "@/entities/power-system/power-system.schema";
import {
  ethnicGroups,
  ethnicGroupsRelations,
  races,
  racesRelations,
} from "@/entities/race/race.schema";
import {
  regionClimateEnum,
  regionFeatureTypeEnum,
  regions,
  regionsRelations,
  regionTypeEnum,
} from "@/entities/region/region.schema";
import {
  religions,
  religionsRelations,
} from "@/entities/religion/religion.schema";
import {
  universes,
  universesRelations,
} from "@/entities/universe/universe.schema";
import { users, usersRelations } from "@/entities/user/user.schema";

const schema = {
  users,
  usersRelations,
  universes,
  universesRelations,
  galaxies,
  galaxiesRelations,
  solarSystems,
  solarSystemsRelations,
  stars,
  starsRelations,
  planets,
  planetsRelations,
  characters,
  charactersRelations,
  constructs,
  constructsRelations,
  maps,
  mapsRelations,
  rootsOfPower,
  rootsOfPowerRelations,
  powerSystems,
  powerSystemsRelations,
  powerSubSystems,
  powerSubSystemsRelations,
  powerCategories,
  powerCategoriesRelations,
  powerAbilities,
  powerAbilitiesRelations,
  characterPowerAccess,
  characterPowerAccessRelations,
  races,
  racesRelations,
  ethnicGroups,
  ethnicGroupsRelations,
  regions,
  regionsRelations,
  regionTypeEnum,
  regionClimateEnum,
  regionFeatureTypeEnum,
  religions,
  religionsRelations,
  galaxyTypeEnum,
  spectralTypeEnum,
  constructCategoryEnum,
};

export default schema;
