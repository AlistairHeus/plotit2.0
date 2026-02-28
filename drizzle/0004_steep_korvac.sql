CREATE TYPE "public"."galaxy_type" AS ENUM('SPIRAL', 'BARRED_SPIRAL', 'ELLIPTICAL', 'IRREGULAR', 'LENTICULAR', 'RING', 'DWARF', 'QUASAR');--> statement-breakpoint
CREATE TYPE "public"."spectral_type" AS ENUM('HOT_BLUE_STAR', 'BLUE_WHITE_STAR', 'WHITE_STAR', 'YELLOW_WHITE_STAR', 'YELLOW_STAR', 'ORANGE_STAR', 'RED_STAR', 'LUMINOUS_RED_GIANT', 'SUPER_GIANT', 'WHITE_DWARF', 'NEUTRON_STAR', 'BLACK_HOLE', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."construct_category" AS ENUM('AFFLICTIONS', 'MANIFESTATIONS', 'ENTITIES', 'VESTIGES');--> statement-breakpoint
CREATE TYPE "public"."region_climate" AS ENUM('TROPICAL', 'SUBTROPICAL', 'TEMPERATE', 'SUBARCTIC', 'ARCTIC', 'DESERT', 'MEDITERRANEAN', 'OCEANIC', 'CONTINENTAL', 'ALPINE', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."region_feature_type" AS ENUM('MOUNTAIN', 'HILL', 'FOREST', 'DESERT', 'WATER', 'GRASSLAND', 'SETTLEMENT', 'LANDMARK', 'CUSTOM');--> statement-breakpoint
CREATE TYPE "public"."region_type" AS ENUM('CONTINENT', 'OCEAN', 'SEA', 'LAKE', 'STATE', 'CITY', 'MOUNTAIN_RANGE', 'FOREST', 'DESERT', 'ISLAND', 'VALLEY', 'RIVER');--> statement-breakpoint
CREATE TABLE "galaxies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "galaxy_type" DEFAULT 'SPIRAL' NOT NULL,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "planets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solar_system_id" uuid NOT NULL,
	"parent_planet_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"color" text,
	"is_habitable" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "solar_systems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"galaxy_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"solar_system_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"type" "spectral_type" DEFAULT 'YELLOW_STAR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "characters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"race_id" uuid,
	"ethnic_group_id" uuid,
	"name" text NOT NULL,
	"background" text,
	"type" text,
	"gender" text DEFAULT 'unspecified',
	"age" integer,
	"color_code" text,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"benched" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "constructs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "construct_category" NOT NULL,
	"universe_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"properties" jsonb,
	"rarity" text,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grid_cell_features" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grid_cell_id" uuid NOT NULL,
	"feature_type" "region_feature_type" NOT NULL,
	"intensity" double precision DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "grid_cells" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"row" integer NOT NULL,
	"col" integer NOT NULL,
	"region_id" uuid,
	"terrain_type" text,
	"feature_type" "region_feature_type",
	"elevation" double precision,
	"path_data" text,
	CONSTRAINT "grid_cells_map_id_row_col_unique" UNIQUE("map_id","row","col")
);
--> statement-breakpoint
CREATE TABLE "map_regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	"z_index" integer DEFAULT 0 NOT NULL,
	"opacity" double precision DEFAULT 1 NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"bounds_top" double precision,
	"bounds_left" double precision,
	"bounds_right" double precision,
	"bounds_bottom" double precision,
	CONSTRAINT "map_regions_map_id_region_id_unique" UNIQUE("map_id","region_id")
);
--> statement-breakpoint
CREATE TABLE "maps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"universe_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	"image_url" text NOT NULL,
	"grid_enabled" boolean DEFAULT true NOT NULL,
	"grid_size" integer DEFAULT 20 NOT NULL,
	"grid_scale" double precision DEFAULT 1 NOT NULL,
	"svg_content" text,
	"view_box" text,
	"grid_height" integer,
	"grid_hex_height" double precision,
	"grid_hex_width" double precision,
	"grid_horizontal_spacing" double precision,
	"grid_vertical_spacing" double precision,
	"grid_width" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "region_svg_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"map_id" uuid NOT NULL,
	"region_id" uuid NOT NULL,
	"svg_state_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "region_svg_mappings_map_id_svg_state_id_unique" UNIQUE("map_id","svg_state_id")
);
--> statement-breakpoint
CREATE TABLE "character_power_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"character_id" uuid NOT NULL,
	"power_system_id" uuid,
	"subsystem_id" uuid,
	"category_id" uuid,
	"ability_id" uuid,
	"access_level" integer DEFAULT 1 NOT NULL,
	"mastery_points" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"unlocked_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "character_power_access_character_id_power_system_id_subsystem_id_category_id_ability_id_unique" UNIQUE("character_id","power_system_id","subsystem_id","category_id","ability_id")
);
--> statement-breakpoint
CREATE TABLE "power_abilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rank" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"requirements" jsonb,
	"icon" text,
	"color" text,
	"cooldown" integer,
	"mana_cost" integer,
	"damage" jsonb,
	"effects" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "power_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"subsystem_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rank" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"requirements" jsonb,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "power_subsystems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"power_system_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rank" integer DEFAULT 1 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"requirements" jsonb,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "power_systems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"root_of_power_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"rank" integer DEFAULT 1 NOT NULL,
	"rules" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"icon" text,
	"color" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roots_of_power" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ethnic_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"race_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"physical_characteristics" text[],
	"cultural_traits" text[],
	"regional_adaptations" text[],
	"climate_influences" text[],
	"languages" text[],
	"geographic_origin" text,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "races" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"lifespan" text,
	"languages" text[],
	"origins" text,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"universe_id" uuid NOT NULL,
	"parent_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"type" "region_type" NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"planet_id" uuid,
	"area" double precision,
	"boundaries" jsonb,
	"capital" text,
	"coastline_length" double precision,
	"coordinates" jsonb,
	"culture" text,
	"elevation" double precision,
	"government" text,
	"language" text[] DEFAULT '{}' NOT NULL,
	"population" integer,
	"religion_id" uuid,
	"rainfall" double precision,
	"temperature" double precision,
	"water_bodies" integer,
	"climate" "region_climate",
	"resources" text[] DEFAULT '{}' NOT NULL,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "religions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"deities" text[] DEFAULT '{}' NOT NULL,
	"tenets" text[] DEFAULT '{}' NOT NULL,
	"practices" text[] DEFAULT '{}' NOT NULL,
	"holy_sites" text[] DEFAULT '{}' NOT NULL,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "galaxies" ADD CONSTRAINT "galaxies_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "planets" ADD CONSTRAINT "planets_solar_system_id_solar_systems_id_fk" FOREIGN KEY ("solar_system_id") REFERENCES "public"."solar_systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solar_systems" ADD CONSTRAINT "solar_systems_galaxy_id_galaxies_id_fk" FOREIGN KEY ("galaxy_id") REFERENCES "public"."galaxies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stars" ADD CONSTRAINT "stars_solar_system_id_solar_systems_id_fk" FOREIGN KEY ("solar_system_id") REFERENCES "public"."solar_systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "characters" ADD CONSTRAINT "characters_ethnic_group_id_ethnic_groups_id_fk" FOREIGN KEY ("ethnic_group_id") REFERENCES "public"."ethnic_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "constructs" ADD CONSTRAINT "constructs_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grid_cell_features" ADD CONSTRAINT "grid_cell_features_grid_cell_id_grid_cells_id_fk" FOREIGN KEY ("grid_cell_id") REFERENCES "public"."grid_cells"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grid_cells" ADD CONSTRAINT "grid_cells_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "grid_cells" ADD CONSTRAINT "grid_cells_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_regions" ADD CONSTRAINT "map_regions_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_regions" ADD CONSTRAINT "map_regions_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maps" ADD CONSTRAINT "maps_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maps" ADD CONSTRAINT "maps_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_svg_mappings" ADD CONSTRAINT "region_svg_mappings_map_id_maps_id_fk" FOREIGN KEY ("map_id") REFERENCES "public"."maps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "region_svg_mappings" ADD CONSTRAINT "region_svg_mappings_region_id_regions_id_fk" FOREIGN KEY ("region_id") REFERENCES "public"."regions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_power_access" ADD CONSTRAINT "character_power_access_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_power_access" ADD CONSTRAINT "character_power_access_power_system_id_power_systems_id_fk" FOREIGN KEY ("power_system_id") REFERENCES "public"."power_systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_power_access" ADD CONSTRAINT "character_power_access_subsystem_id_power_subsystems_id_fk" FOREIGN KEY ("subsystem_id") REFERENCES "public"."power_subsystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_power_access" ADD CONSTRAINT "character_power_access_category_id_power_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."power_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_power_access" ADD CONSTRAINT "character_power_access_ability_id_power_abilities_id_fk" FOREIGN KEY ("ability_id") REFERENCES "public"."power_abilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_abilities" ADD CONSTRAINT "power_abilities_category_id_power_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."power_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_categories" ADD CONSTRAINT "power_categories_subsystem_id_power_subsystems_id_fk" FOREIGN KEY ("subsystem_id") REFERENCES "public"."power_subsystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_subsystems" ADD CONSTRAINT "power_subsystems_power_system_id_power_systems_id_fk" FOREIGN KEY ("power_system_id") REFERENCES "public"."power_systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_systems" ADD CONSTRAINT "power_systems_root_of_power_id_roots_of_power_id_fk" FOREIGN KEY ("root_of_power_id") REFERENCES "public"."roots_of_power"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roots_of_power" ADD CONSTRAINT "roots_of_power_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ethnic_groups" ADD CONSTRAINT "ethnic_groups_race_id_races_id_fk" FOREIGN KEY ("race_id") REFERENCES "public"."races"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "races" ADD CONSTRAINT "races_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_planet_id_planets_id_fk" FOREIGN KEY ("planet_id") REFERENCES "public"."planets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regions" ADD CONSTRAINT "regions_religion_id_religions_id_fk" FOREIGN KEY ("religion_id") REFERENCES "public"."religions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "religions" ADD CONSTRAINT "religions_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "constructs_universe_idx" ON "constructs" USING btree ("universe_id");--> statement-breakpoint
CREATE INDEX "constructs_category_idx" ON "constructs" USING btree ("category");--> statement-breakpoint
CREATE INDEX "constructs_name_idx" ON "constructs" USING btree ("name");--> statement-breakpoint
CREATE INDEX "religions_universe_idx" ON "religions" USING btree ("universe_id");--> statement-breakpoint
CREATE INDEX "religions_name_idx" ON "religions" USING btree ("name");