CREATE TYPE "public"."nature_type" AS ENUM('PLANT', 'ANIMAL', 'MINERAL');--> statement-breakpoint
CREATE TABLE "nature" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"universe_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" "nature_type" NOT NULL,
	"description" text,
	"avatar_url" text,
	"image_urls" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "nature" ADD CONSTRAINT "nature_universe_id_universes_id_fk" FOREIGN KEY ("universe_id") REFERENCES "public"."universes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "nature_universe_idx" ON "nature" USING btree ("universe_id");--> statement-breakpoint
CREATE INDEX "nature_type_idx" ON "nature" USING btree ("type");--> statement-breakpoint
CREATE INDEX "nature_name_idx" ON "nature" USING btree ("name");