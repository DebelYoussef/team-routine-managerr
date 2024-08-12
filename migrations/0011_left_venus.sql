ALTER TABLE "response" ADD COLUMN "questionId" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "response" ADD CONSTRAINT "response_questionId_question_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
