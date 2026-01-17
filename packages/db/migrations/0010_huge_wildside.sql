ALTER TABLE "multiplayer_game" DROP CONSTRAINT "multiplayer_game_status_id_attempt_question_status_fk";
--> statement-breakpoint
ALTER TABLE "multiplayer_game" ADD CONSTRAINT "multiplayer_game_status_id_attempt_id_fk" FOREIGN KEY ("status_id") REFERENCES "public"."attempt"("id") ON DELETE no action ON UPDATE no action;