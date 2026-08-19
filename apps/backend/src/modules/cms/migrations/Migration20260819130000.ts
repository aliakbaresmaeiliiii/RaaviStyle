import { Migration } from "@medusajs/framework/mikro-orm/migrations"

export class Migration20260819130000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "site_page" drop column if exists "images";`)
    this.addSql(`alter table "site_page" add column if not exists "images" text[] null;`)
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "site_page" drop column if exists "images";`)
    this.addSql(`alter table "site_page" add column if not exists "images" jsonb null;`)
  }
}