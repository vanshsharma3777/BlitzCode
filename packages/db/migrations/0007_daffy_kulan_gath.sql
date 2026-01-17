CREATE TABLE "multiplyaer_game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"time_taken" integer NOT NULL,
	"score" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"status_id" uuid[] NOT NULL
);
--> statement-breakpoint
ALTER TABLE "total_correct" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "total_wrong" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "total_correct" CASCADE;--> statement-breakpoint
DROP TABLE "total_wrong" CASCADE;--> statement-breakpoint
ALTER TABLE "attempt" DROP CONSTRAINT "attempt_total_correct_total_correct_id_fk";
--> statement-breakpoint
ALTER TABLE "attempt" DROP CONSTRAINT "attempt_total_wrong_total_wrong_id_fk";
--> statement-breakpoint
ALTER TABLE "multiplyaer_game" ADD CONSTRAINT "multiplyaer_game_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multiplyaer_game" ADD CONSTRAINT "multiplyaer_game_status_id_attempt_question_status_fk" FOREIGN KEY ("status_id") REFERENCES "public"."attempt"("question_status") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" DROP COLUMN "total_correct";--> statement-breakpoint
ALTER TABLE "attempt" DROP COLUMN "total_wrong";