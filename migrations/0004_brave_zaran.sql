CREATE TABLE IF NOT EXISTS "peopleToRemind" (
	"id" serial PRIMARY KEY NOT NULL,
	"employeeId" integer NOT NULL,
	"reminderId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reminders" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(455) NOT NULL,
	"reminder_time" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "peopleToRemind" ADD CONSTRAINT "peopleToRemind_employeeId_user_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "peopleToRemind" ADD CONSTRAINT "peopleToRemind_reminderId_reminders_id_fk" FOREIGN KEY ("reminderId") REFERENCES "public"."reminders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
