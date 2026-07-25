import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "about_gallery" CASCADE;
    ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "vision_image_id" integer;
    ALTER TABLE "about_locales" ADD COLUMN IF NOT EXISTS "vision_text" varchar;

    DO $$ BEGIN
      ALTER TABLE "about" ADD CONSTRAINT "about_vision_image_id_media_id_fk"
        FOREIGN KEY ("vision_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "about_vision_image_idx" ON "about" USING btree ("vision_image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql``)
}
