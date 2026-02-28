ALTER TABLE "maps" DROP COLUMN "grid_settings";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "map_overlays";--> statement-breakpoint
ALTER TABLE "maps" DROP COLUMN "cell_data";--> statement-breakpoint
ALTER TABLE "map_svg_mappings" ADD CONSTRAINT "uq_map_svg_element" UNIQUE("map_id","svg_element_id");