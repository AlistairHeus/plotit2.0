CREATE TYPE "public"."relationship_type" AS ENUM('SPOUSE', 'PARENT_OF', 'SIBLING_OF', 'REPORTS_TO');--> statement-breakpoint
CREATE TABLE "character_relationships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"source_character_id" uuid NOT NULL,
	"target_character_id" uuid NOT NULL,
	"type" "relationship_type" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "factions" DROP CONSTRAINT "factions_headquarters_id_regions_id_fk";
--> statement-breakpoint
ALTER TABLE "factions" DROP CONSTRAINT "factions_leader_id_characters_id_fk";
--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_source_character_id_characters_id_fk" FOREIGN KEY ("source_character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_target_character_id_characters_id_fk" FOREIGN KEY ("target_character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faction_members" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "faction_members" DROP COLUMN "updated_at";--> statement-breakpoint
ALTER TABLE "factions" DROP COLUMN "parent_id";--> statement-breakpoint
ALTER TABLE "factions" DROP COLUMN "headquarters_id";--> statement-breakpoint
ALTER TABLE "factions" DROP COLUMN "leader_id";