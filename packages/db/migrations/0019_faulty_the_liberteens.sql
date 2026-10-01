DROP INDEX "submissions_problem_idx";--> statement-breakpoint
CREATE INDEX "submissions_problem_lang_idx" ON "submissions" USING btree ("problem_id","language");