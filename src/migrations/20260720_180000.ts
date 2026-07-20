import { sql } from '@payloadcms/db-postgres'
import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/**
 * Home redesign: role, intro manifesto, CTA label (localized).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_locales" ADD COLUMN IF NOT EXISTS "role" varchar;
  ALTER TABLE "home_locales" ADD COLUMN IF NOT EXISTS "intro" varchar;
  ALTER TABLE "home_locales" ADD COLUMN IF NOT EXISTS "cta_label" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "home_locales" DROP COLUMN IF EXISTS "role";
  ALTER TABLE "home_locales" DROP COLUMN IF EXISTS "intro";
  ALTER TABLE "home_locales" DROP COLUMN IF EXISTS "cta_label";
  `)
}
