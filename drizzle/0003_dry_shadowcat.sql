ALTER TABLE "universes" RENAME COLUMN "owner_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "universes" DROP CONSTRAINT "universes_owner_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "universes" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "universes" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "universes" ADD CONSTRAINT "universes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;