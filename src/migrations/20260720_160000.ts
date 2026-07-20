import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * About page redesign: profile portrait + bottom gallery images.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "about" ADD COLUMN IF NOT EXISTS "profile_image_id" integer;

  DO $$ BEGIN
    ALTER TABLE "about" ADD CONSTRAINT "about_profile_image_id_media_id_fk"
      FOREIGN KEY ("profile_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "about_profile_image_idx" ON "about" USING btree ("profile_image_id");

  CREATE TABLE IF NOT EXISTS "about_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );

  DO $$ BEGIN
    ALTER TABLE "about_gallery" ADD CONSTRAINT "about_gallery_image_id_media_id_fk"
      FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "about_gallery" ADD CONSTRAINT "about_gallery_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "about_gallery_order_idx" ON "about_gallery" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "about_gallery_parent_id_idx" ON "about_gallery" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "about_gallery_image_idx" ON "about_gallery" USING btree ("image_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "about_gallery" CASCADE;
  ALTER TABLE "about" DROP CONSTRAINT IF EXISTS "about_profile_image_id_media_id_fk";
  DROP INDEX IF EXISTS "about_profile_image_idx";
  ALTER TABLE "about" DROP COLUMN IF EXISTS "profile_image_id";
  `)
}
