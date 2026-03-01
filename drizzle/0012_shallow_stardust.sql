ALTER TABLE "galaxies" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "galaxies" ALTER COLUMN "type" SET DEFAULT 'SPIRAL'::text;--> statement-breakpoint
DROP TYPE "public"."galaxy_type";--> statement-breakpoint
CREATE TYPE "public"."galaxy_type" AS ENUM('SPIRAL', 'BARRED_SPIRAL', 'ELLIPTICAL', 'IRREGULAR', 'LENTICULAR', 'RING', 'DWARF');--> statement-breakpoint
ALTER TABLE "galaxies" ALTER COLUMN "type" SET DEFAULT 'SPIRAL'::"public"."galaxy_type";--> statement-breakpoint
ALTER TABLE "galaxies" ALTER COLUMN "type" SET DATA TYPE "public"."galaxy_type" USING "type"::"public"."galaxy_type";