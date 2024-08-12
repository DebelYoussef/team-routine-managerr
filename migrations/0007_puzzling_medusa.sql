ALTER TABLE "note" ALTER COLUMN "text" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "tags" varchar(755);