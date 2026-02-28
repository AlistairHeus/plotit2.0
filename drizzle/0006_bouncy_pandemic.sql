ALTER TABLE "maps" ALTER COLUMN "grid_settings" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "maps" ALTER COLUMN "map_overlays" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "maps" ALTER COLUMN "svg_mappings" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "maps" ALTER COLUMN "cell_data" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "regions" ALTER COLUMN "features" SET DEFAULT '{}'::"public"."region_feature_type"[];--> statement-breakpoint
ALTER TABLE "regions" ALTER COLUMN "features" SET DATA TYPE "public"."region_feature_type"[] USING "features"::"public"."region_feature_type"[];