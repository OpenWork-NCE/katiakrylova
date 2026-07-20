import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Contact page background image.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "background_image_id" integer;

  DO $$ BEGIN
    ALTER TABLE "contact" ADD CONSTRAINT "contact_background_image_id_media_id_fk"
      FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "contact_background_image_idx" ON "contact" USING btree ("background_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "contact" DROP CONSTRAINT IF EXISTS "contact_background_image_id_media_id_fk";
  DROP INDEX IF EXISTS "contact_background_image_idx";
  ALTER TABLE "contact" DROP COLUMN IF EXISTS "background_image_id";
  `)
}
