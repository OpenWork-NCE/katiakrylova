import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_projects_format" ADD VALUE IF NOT EXISTS 'Animation';
    ALTER TYPE "public"."enum__projects_v_version_format" ADD VALUE IF NOT EXISTS 'Animation';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql``)
}
