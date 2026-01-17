CREATE TABLE "multiplayer_game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"time_taken" integer NOT NULL,
	"score" integer NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"status_id" uuid[] NOT NULL,
	CONSTRAINT "multiplayer_game_id_unique" UNIQUE("id")
);
--> statement-breakpoint
ALTER TABLE "multiplyaer_game" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "multiplyaer_game" CASCADE;--> statement-breakpoint
ALTER TABLE "multiplayer_game" ADD CONSTRAINT "multiplayer_game_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multiplayer_game" ADD CONSTRAINT "multiplayer_game_status_id_attempt_question_status_fk" FOREIGN KEY ("status_id") REFERENCES "public"."attempt"("question_status") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt" ADD CONSTRAINT "attempt_id_unique" UNIQUE("id");