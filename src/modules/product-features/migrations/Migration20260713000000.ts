import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260713000000 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      `create table if not exists "feature" ("id" text not null, "title" text not null, "subtitle" text null, "icon" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "feature_pkey" primary key ("id"));`
    )
    this.addSql(
      `CREATE INDEX IF NOT EXISTS "IDX_feature_deleted_at" ON "feature" (deleted_at) WHERE deleted_at IS NULL;`
    )
  }

  async down(): Promise<void> {
    this.addSql(`drop table if exists "feature" cascade;`)
  }
}
