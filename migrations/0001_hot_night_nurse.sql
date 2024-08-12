CREATE TABLE IF NOT EXISTS "membership" (
	"id" serial PRIMARY KEY NOT NULL,
	"employeeId" integer NOT NULL,
	"routineId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "option" (
	"id" serial PRIMARY KEY NOT NULL,
	"optionValue" varchar(255) NOT NULL,
	"questionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" serial PRIMARY KEY NOT NULL,
	"routineId" integer NOT NULL,
	"question" varchar(255) NOT NULL,
	"type" varchar(50)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "routine" (
	"id" serial PRIMARY KEY NOT NULL,
	"routineName" varchar(255) NOT NULL,
	"startTime" timestamp NOT NULL,
	"type" varchar(50),
	"reminder" varchar(50),
	"userId" integer NOT NULL,
	"active" boolean NOT NULL,
	"privacy" varchar(50),
	"description" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "society" (
	"id" serial PRIMARY KEY NOT NULL,
	"societyName" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"firstName" varchar(50) NOT NULL,
	"lastName" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"societyId" integer NOT NULL,
	"role" varchar(50)
);
--> statement-breakpoint
DROP TABLE "posts_table";--> statement-breakpoint
DROP TABLE "users_table";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membership" ADD CONSTRAINT "membership_employeeId_user_id_fk" FOREIGN KEY ("employeeId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "membership" ADD CONSTRAINT "membership_routineId_routine_id_fk" FOREIGN KEY ("routineId") REFERENCES "public"."routine"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "option" ADD CONSTRAINT "option_questionId_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_routineId_routine_id_fk" FOREIGN KEY ("routineId") REFERENCES "public"."routine"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "routine" ADD CONSTRAINT "routine_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_societyId_society_id_fk" FOREIGN KEY ("societyId") REFERENCES "public"."society"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
