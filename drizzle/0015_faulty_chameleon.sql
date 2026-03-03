CREATE TYPE "public"."character_type" AS ENUM('Protagonist', 'Antagonist', 'Supporting', 'Minor', 'Background');--> statement-breakpoint
UPDATE "characters" SET "type" = 'Protagonist' WHERE "type" = 'Main';--> statement-breakpoint
UPDATE "characters" SET "type" = 'Background' WHERE "type" NOT IN ('Protagonist', 'Antagonist', 'Supporting', 'Minor', 'Background') AND "type" IS NOT NULL;--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "type" SET DATA TYPE character_type USING "type"::character_type;