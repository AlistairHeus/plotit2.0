CREATE TYPE "public"."character_gender" AS ENUM('Male', 'Female', 'Unspecified');--> statement-breakpoint
UPDATE "characters" SET "gender" = 'Male' WHERE LOWER("gender") = 'male';--> statement-breakpoint
UPDATE "characters" SET "gender" = 'Female' WHERE LOWER("gender") = 'female';--> statement-breakpoint
UPDATE "characters" SET "gender" = 'Unspecified' WHERE "gender" NOT IN ('Male', 'Female', 'Unspecified') OR "gender" IS NULL;--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "gender" SET DEFAULT 'Unspecified'::character_gender;--> statement-breakpoint
ALTER TABLE "characters" ALTER COLUMN "gender" SET DATA TYPE character_gender USING "gender"::character_gender;