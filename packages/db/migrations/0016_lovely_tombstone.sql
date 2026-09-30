CREATE TABLE "problem_test" (
	"problem_id" uuid PRIMARY KEY NOT NULL,
	"private_tests" jsonb,
	"generated_tests" jsonb
);
--> statement-breakpoint
CREATE TABLE "problem" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" integer,
	"cf_rating" integer,
	"cf_tags" text[],
	"time_limit" jsonb,
	"memory_limit_bytes" bigint,
	"public_tests" jsonb,
	"split" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problem_test" ADD CONSTRAINT "problem_test_problem_id_problem_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problem"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "problem_difficulty_idx" ON "problem" USING btree ("difficulty");--> statement-breakpoint
CREATE INDEX "problem_rating_idx" ON "problem" USING btree ("cf_rating");--> statement-breakpoint
CREATE INDEX "problem_tags_idx" ON "problem" USING gin ("cf_tags");--> statement-breakpoint
CREATE INDEX "problem_search_idx" ON "problem" USING gin (to_tsvector('english', "name" || ' ' || "description"));