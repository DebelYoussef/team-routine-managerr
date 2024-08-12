CREATE TABLE IF NOT EXISTS "response" (
	"id" serial PRIMARY KEY NOT NULL,
	"employeeId" integer NOT NULL,
	"routineId" integer NOT NULL,
	"value" varchar(255) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "response" ADD CONSTRAINT "response_employeeId_user_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "response" ADD CONSTRAINT "response_routineId_routine_id_fk" FOREIGN KEY ("routineId") REFERENCES "public"."routine"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
