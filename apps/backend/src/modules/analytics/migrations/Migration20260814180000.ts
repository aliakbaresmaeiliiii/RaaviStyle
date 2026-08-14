import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260814180000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "site_event" ("id" text not null, "kind" text not null default 'visit', "path" text not null default '/', "session_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "site_event_pkey" primary key ("id"));`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_site_event_deleted_at" ON "site_event" (deleted_at) WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_site_event_created_at" ON "site_event" (created_at) WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_site_event_kind" ON "site_event" (kind) WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "site_event" cascade;`)
  }
}
