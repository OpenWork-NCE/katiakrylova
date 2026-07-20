import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Remove Links global (page /liens) and related tables.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DROP TABLE IF EXISTS "links_items_locales" CASCADE;
  DROP TABLE IF EXISTS "links_items" CASCADE;
  DROP TABLE IF EXISTS "links" CASCADE;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE IF NOT EXISTS "links_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "links_items_locales" (
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "links_items" ADD CONSTRAINT "links_items_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "links_items_locales" ADD CONSTRAINT "links_items_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."links_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  DO $$ BEGIN
    ALTER TABLE "links" ADD CONSTRAINT "links_photo_id_media_id_fk"
      FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null; END $$;

  CREATE INDEX IF NOT EXISTS "links_items_order_idx" ON "links_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "links_items_parent_id_idx" ON "links_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "links_items_locales_locale_parent_id_unique"
    ON "links_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX IF NOT EXISTS "links_photo_idx" ON "links" USING btree ("photo_id");
  `)
}
