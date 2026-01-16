ALTER TABLE "question" ALTER COLUMN "options" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "correct_options" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN "correct_option";