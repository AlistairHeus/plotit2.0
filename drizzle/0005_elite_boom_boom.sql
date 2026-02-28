DROP TABLE "grid_cell_features" CASCADE;--> statement-breakpoint
DROP TABLE "grid_cells" CASCADE;--> statement-breakpoint
DROP TABLE "map_regions" CASCADE;--> statement-breakpoint
DROP TABLE "region_svg_mappings" CASCADE;--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN "grid_settings" jsonb DEFAULT '{"enabled":true,"size":20,"scale":1,"width":null,"height":null,"hexWidth":null,"hexHeight":null,"horizontalSpacing":null,"verticalSpacing":null}'::jsonb;--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN "map_overlays" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN "svg_mappings" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "maps" ADD COLUMN "cell_data" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_enabled";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_size";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_scale";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_height";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_hex_height";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_hex_width";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_horizontal_spacing";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_vertical_spacing";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "grid_width";