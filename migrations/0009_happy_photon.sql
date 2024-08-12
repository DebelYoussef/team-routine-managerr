CREATE TABLE IF NOT EXISTS "notification" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(455) NOT NULL,
	"employeeId" integer NOT NULL,
	"link" varchar(755),
	"seen" boolean
);
--> statement-breakpoint
DROP TABLE "notifications";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_employeeId_user_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
