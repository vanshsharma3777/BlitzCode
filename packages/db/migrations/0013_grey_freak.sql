ALTER TABLE "question_attempted" DROP CONSTRAINT "question_attempted_question_id_question_id_fk";
--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "questionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "question_attempted" ADD CONSTRAINT "question_attempted_question_id_question_questionId_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("questionId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "questions_fetch_idx" ON "question" USING btree ("topic","difficulty","language","question_type");--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN "id";