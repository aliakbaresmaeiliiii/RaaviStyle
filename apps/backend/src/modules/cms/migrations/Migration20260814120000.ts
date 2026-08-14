import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260814120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table if not exists "site_page" ("id" text not null, "handle" text not null, "title" text not null, "body" text not null default '', "image_url" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "site_page_pkey" primary key ("id"));`)
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_site_page_handle_unique" ON "site_page" (handle) WHERE deleted_at IS NULL;`)
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_site_page_deleted_at" ON "site_page" (deleted_at) WHERE deleted_at IS NULL;`)
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "site_page" cascade;`)
  }
}
