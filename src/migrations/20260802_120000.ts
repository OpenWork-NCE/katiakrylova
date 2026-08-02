import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

/** Contact: related card-game creation sites (Ego Du Moi, Le Tarot Décrypté). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "ego_du_moi_url" varchar;
    ALTER TABLE "contact" ADD COLUMN IF NOT EXISTS "tarot_decrypte_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "contact" DROP COLUMN IF EXISTS "ego_du_moi_url";
    ALTER TABLE "contact" DROP COLUMN IF EXISTS "tarot_decrypte_url";
  `)
}
