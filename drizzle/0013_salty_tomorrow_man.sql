ALTER TABLE "regions" DROP COLUMN "features";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "area";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "boundaries";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "capital";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "coastline_length";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "coordinates";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "culture";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "elevation";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "government";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "language";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "population";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "rainfall";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "temperature";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "water_bodies";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "climate";--> statement-breakpoint
ALTER TABLE "regions" DROP COLUMN "resources";--> statement-breakpoint
DROP TYPE "public"."region_climate";--> statement-breakpoint
DROP TYPE "public"."region_feature_type";