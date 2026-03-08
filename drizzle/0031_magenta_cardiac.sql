CREATE TYPE "public"."occurance" AS ENUM('EXTANT', 'EXTINCT', 'MYTHICAL');--> statement-breakpoint
ALTER TABLE "nature" ADD COLUMN "occurance" "occurance" DEFAULT 'EXTANT';