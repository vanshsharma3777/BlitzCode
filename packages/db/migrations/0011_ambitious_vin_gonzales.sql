ALTER TABLE "multiplayer_game" RENAME COLUMN "status_id" TO "attempt_id";--> statement-breakpoint
ALTER TABLE "multiplayer_game" DROP CONSTRAINT "multiplayer_game_status_id_attempt_id_fk";
--> statement-breakpoint
ALTER TABLE "multiplayer_game" ADD CONSTRAINT "multiplayer_game_attempt_id_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempt"("id") ON DELETE no action ON UPDATE no action;