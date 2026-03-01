ALTER TABLE "galaxies" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "galaxies" ADD COLUMN "image_urls" text[];--> statement-breakpoint
ALTER TABLE "planets" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "planets" ADD COLUMN "image_urls" text[];--> statement-breakpoint
ALTER TABLE "solar_systems" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "solar_systems" ADD COLUMN "image_urls" text[];--> statement-breakpoint
ALTER TABLE "stars" ADD COLUMN "avatar_url" text;--> statement-breakpoint
ALTER TABLE "stars" ADD COLUMN "image_urls" text[];--> statement-breakpoint
ALTER TABLE "ethnic_groups" DROP COLUMN "physical_characteristics";--> statement-breakpoint
ALTER TABLE "ethnic_groups" DROP COLUMN "cultural_traits";--> statement-breakpoint
ALTER TABLE "ethnic_groups" DROP COLUMN "regional_adaptations";--> statement-breakpoint
ALTER TABLE "ethnic_groups" DROP COLUMN "climate_influences";--> statement-breakpoint
ALTER TABLE "ethnic_groups" DROP COLUMN "languages";--> statement-breakpoint
ALTER TABLE "ethnic_groups" DROP COLUMN "geographic_origin";--> statement-breakpoint
ALTER TABLE "races" DROP COLUMN "origins";