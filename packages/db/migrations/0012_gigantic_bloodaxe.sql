CREATE TABLE "multiplayer_attempts" (
	"multiplayer_id" uuid NOT NULL,
	"attempt_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "multiplayer_game" DROP CONSTRAINT "multiplayer_game_id_unique";--> statement-breakpoint
ALTER TABLE "multiplayer_game" DROP CONSTRAINT "multiplayer_game_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "multiplayer_game" DROP CONSTRAINT "multiplayer_game_attempt_id_attempt_id_fk";
--> statement-breakpoint
ALTER TABLE "multiplayer_game" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "multiplayer_attempts" ADD CONSTRAINT "multiplayer_attempts_multiplayer_id_multiplayer_game_id_fk" FOREIGN KEY ("multiplayer_id") REFERENCES "public"."multiplayer_game"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multiplayer_attempts" ADD CONSTRAINT "multiplayer_attempts_attempt_id_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multiplayer_game" ADD CONSTRAINT "multiplayer_game_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "multiplayer_game" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "multiplayer_game" DROP COLUMN "attempt_id";