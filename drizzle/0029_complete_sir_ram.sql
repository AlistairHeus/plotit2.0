ALTER TABLE "faction_members" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "faction_members" CASCADE;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD COLUMN "faction_id" uuid;--> statement-breakpoint
ALTER TABLE "character_relationships" ADD CONSTRAINT "character_relationships_faction_id_factions_id_fk" FOREIGN KEY ("faction_id") REFERENCES "public"."factions"("id") ON DELETE cascade ON UPDATE no action;