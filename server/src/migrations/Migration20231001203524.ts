import { Migration } from '@mikro-orm/migrations';

export class Migration20231001203524 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "title" type varchar(255) using ("title"::varchar(255));');
    this.addSql('alter table "post" drop constraint "post_pkey";');
    this.addSql('alter table "post" rename column "_id" to "id";');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "title" type text using ("title"::text);');
    this.addSql('alter table "post" drop constraint "post_pkey";');
    this.addSql('alter table "post" rename column "id" to "_id";');
    this.addSql('alter table "post" add constraint "post_pkey" primary key ("_id");');
  }

}
