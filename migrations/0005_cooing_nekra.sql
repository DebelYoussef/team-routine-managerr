ALTER TABLE "reminders" ALTER COLUMN "title" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "reminders" ADD COLUMN "description" varchar(455) NOT NULL;