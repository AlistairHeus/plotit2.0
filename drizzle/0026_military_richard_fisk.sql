ALTER TABLE "factions" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."faction_type";--> statement-breakpoint
CREATE TYPE "public"."faction_type" AS ENUM('GUILD', 'GOVERNMENT', 'MILITARY', 'FAMILY');--> statement-breakpoint
ALTER TABLE "factions" ALTER COLUMN "type" SET DATA TYPE "public"."faction_type" USING "type"::"public"."faction_type";