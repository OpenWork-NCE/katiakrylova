import { sql } from '@payloadcms/db-postgres'
import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_projects_format" ADD VALUE IF NOT EXISTS 'SCÉNARIO';
    ALTER TYPE "public"."enum_projects_format" ADD VALUE IF NOT EXISTS 'PRISE DE VUE';
    ALTER TYPE "public"."enum_projects_format" ADD VALUE IF NOT EXISTS 'MONTAGE';
    ALTER TYPE "public"."enum__projects_v_version_format" ADD VALUE IF NOT EXISTS 'SCÉNARIO';
    ALTER TYPE "public"."enum__projects_v_version_format" ADD VALUE IF NOT EXISTS 'PRISE DE VUE';
    ALTER TYPE "public"."enum__projects_v_version_format" ADD VALUE IF NOT EXISTS 'MONTAGE';

    CREATE TABLE IF NOT EXISTS "projects_format" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum_projects_format",
      "id" serial PRIMARY KEY NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "projects_format_order_idx" ON "projects_format" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "projects_format_parent_idx" ON "projects_format" USING btree ("parent_id");
    DO $$ BEGIN
      ALTER TABLE "projects_format" ADD CONSTRAINT "projects_format_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'projects' AND column_name = 'format'
      ) THEN
        INSERT INTO "projects_format" ("order", "parent_id", "value")
          SELECT 1, "id", "format" FROM "projects" p
          WHERE "format" IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM "projects_format" pf WHERE pf."parent_id" = p."id");
        ALTER TABLE "projects" DROP COLUMN "format";
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "_projects_v_version_format" (
      "order" integer NOT NULL,
      "parent_id" integer NOT NULL,
      "value" "enum__projects_v_version_format",
      "id" serial PRIMARY KEY NOT NULL
    );
    CREATE INDEX IF NOT EXISTS "_projects_v_version_format_order_idx" ON "_projects_v_version_format" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "_projects_v_version_format_parent_idx" ON "_projects_v_version_format" USING btree ("parent_id");
    DO $$ BEGIN
      ALTER TABLE "_projects_v_version_format" ADD CONSTRAINT "_projects_v_version_format_parent_fk"
        FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = '_projects_v' AND column_name = 'version_format'
      ) THEN
        INSERT INTO "_projects_v_version_format" ("order", "parent_id", "value")
          SELECT 1, "id", "version_format" FROM "_projects_v" p
          WHERE "version_format" IS NOT NULL
            AND NOT EXISTS (SELECT 1 FROM "_projects_v_version_format" pf WHERE pf."parent_id" = p."id");
        ALTER TABLE "_projects_v" DROP COLUMN "version_format";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "projects" ADD COLUMN "format" "enum_projects_format";
    UPDATE "projects" AS p SET "format" = formats."value"
      FROM (
        SELECT DISTINCT ON ("parent_id") "parent_id", "value"
        FROM "projects_format"
        WHERE "value" IN ('Court-métrage', 'Clip', 'Performance', 'Documentaire', 'Essai expérimental', 'Making Of')
        ORDER BY "parent_id", "order"
      ) AS formats
      WHERE p."id" = formats."parent_id";
    DROP TABLE "projects_format";

    ALTER TABLE "_projects_v" ADD COLUMN "version_format" "enum__projects_v_version_format";
    UPDATE "_projects_v" AS p SET "version_format" = formats."value"
      FROM (
        SELECT DISTINCT ON ("parent_id") "parent_id", "value"
        FROM "_projects_v_version_format"
        WHERE "value" IN ('Court-métrage', 'Clip', 'Performance', 'Documentaire', 'Essai expérimental', 'Making Of')
        ORDER BY "parent_id", "order"
      ) AS formats
      WHERE p."id" = formats."parent_id";
    DROP TABLE "_projects_v_version_format";
  `)
}
