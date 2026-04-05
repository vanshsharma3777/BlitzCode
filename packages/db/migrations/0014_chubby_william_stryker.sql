CREATE TYPE "public"."status" AS ENUM('used', 'unused');--> statement-breakpoint
ALTER TABLE "question" RENAME COLUMN "correct_options" TO "correctOptions";--> statement-breakpoint
ALTER TABLE "question" RENAME COLUMN "question_type" TO "questionType";--> statement-breakpoint
ALTER TABLE "question" RENAME COLUMN "time_limit" TO "timeLimit";--> statement-breakpoint
DROP TYPE "public"."question_type";--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('single correct', 'multiple correct', 'bugfixer');--> statement-breakpoint
DROP INDEX "questions_fetch_idx";--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "difficulty" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "status" "status" DEFAULT 'unused' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "points_updated" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "questions_fetch_idx" ON "question" USING btree ("topic","difficulty","language","questionType");