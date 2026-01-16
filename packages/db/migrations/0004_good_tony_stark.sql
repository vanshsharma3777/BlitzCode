DROP TABLE "game" CASCADE;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "score" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "total_time" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "game_type" "game_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "attempt" ADD COLUMN "completed_at" timestamp DEFAULT now() NOT NULL;