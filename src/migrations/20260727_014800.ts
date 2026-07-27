import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/** Journal entries: optional related project for News → Projects CTA. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journal_entries" ADD COLUMN IF NOT EXISTS "related_project_id" integer;

    DO $$ BEGIN
      ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_related_project_id_projects_id_fk"
        FOREIGN KEY ("related_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "journal_entries_related_project_idx"
      ON "journal_entries" USING btree ("related_project_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "journal_entries" DROP CONSTRAINT IF EXISTS "journal_entries_related_project_id_projects_id_fk";
    DROP INDEX IF EXISTS "journal_entries_related_project_idx";
    ALTER TABLE "journal_entries" DROP COLUMN IF EXISTS "related_project_id";
  `)
}
