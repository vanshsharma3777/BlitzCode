DROP INDEX "submissions_problem_lang_idx";--> statement-breakpoint
ALTER TABLE "submissions" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
CREATE INDEX "submissions_user_problem_idx" ON "submissions" USING btree ("user_id","problem_id");