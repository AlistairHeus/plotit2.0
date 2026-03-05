ALTER TABLE "power_abilities" ALTER COLUMN "category_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "power_categories" ALTER COLUMN "subsystem_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "power_abilities" ADD COLUMN "power_system_id" uuid;--> statement-breakpoint
ALTER TABLE "power_abilities" ADD COLUMN "subsystem_id" uuid;--> statement-breakpoint
ALTER TABLE "power_categories" ADD COLUMN "power_system_id" uuid;--> statement-breakpoint
ALTER TABLE "power_abilities" ADD CONSTRAINT "power_abilities_power_system_id_power_systems_id_fk" FOREIGN KEY ("power_system_id") REFERENCES "public"."power_systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_abilities" ADD CONSTRAINT "power_abilities_subsystem_id_power_subsystems_id_fk" FOREIGN KEY ("subsystem_id") REFERENCES "public"."power_subsystems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "power_categories" ADD CONSTRAINT "power_categories_power_system_id_power_systems_id_fk" FOREIGN KEY ("power_system_id") REFERENCES "public"."power_systems"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "character_power_access" DROP COLUMN "access_level";--> statement-breakpoint
ALTER TABLE "character_power_access" DROP COLUMN "mastery_points";--> statement-breakpoint
ALTER TABLE "character_power_access" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "character_power_access" DROP COLUMN "unlocked_at";--> statement-breakpoint
ALTER TABLE "character_power_access" DROP COLUMN "usage_count";--> statement-breakpoint
ALTER TABLE "character_power_access" DROP COLUMN "notes";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "rank";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "requirements";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "cooldown";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "mana_cost";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "damage";--> statement-breakpoint
ALTER TABLE "power_abilities" DROP COLUMN "effects";--> statement-breakpoint
ALTER TABLE "power_categories" DROP COLUMN "rank";--> statement-breakpoint
ALTER TABLE "power_categories" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "power_categories" DROP COLUMN "requirements";--> statement-breakpoint
ALTER TABLE "power_categories" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "power_categories" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "power_subsystems" DROP COLUMN "rank";--> statement-breakpoint
ALTER TABLE "power_subsystems" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "power_subsystems" DROP COLUMN "requirements";--> statement-breakpoint
ALTER TABLE "power_subsystems" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "power_subsystems" DROP COLUMN "color";--> statement-breakpoint
ALTER TABLE "power_systems" DROP COLUMN "rank";--> statement-breakpoint
ALTER TABLE "power_systems" DROP COLUMN "rules";--> statement-breakpoint
ALTER TABLE "power_systems" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "power_systems" DROP COLUMN "icon";--> statement-breakpoint
ALTER TABLE "power_systems" DROP COLUMN "color";