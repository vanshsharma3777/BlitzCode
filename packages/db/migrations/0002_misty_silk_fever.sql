CREATE TYPE "public"."question_status" AS ENUM('correct', 'incorrect', 'notAttempted');--> statement-breakpoint
CREATE TABLE "attempt" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_status" "question_status" NOT NULL,
	"userId" uuid NOT NULL,
	"total_correct" uuid NOT NULL,
	"total_wrong" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "topic" text NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "explanation" text NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "correct_option" text;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_total_correct_total_correct_id_fk" FOREIGN KEY ("total_correct") REFERENCES "public"."total_correct"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_total_wrong_total_wrong_id_fk" FOREIGN KEY ("total_wrong") REFERENCES "public"."total_wrong"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN "code";