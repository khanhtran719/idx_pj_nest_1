import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1709873188352 implements MigrationInterface {
  name = 'InitDatabase1709873188352';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "usename" character varying NOT NULL, "fullname" character varying NOT NULL, "password" character varying NOT NULL, "email" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'user', CONSTRAINT "UQ_d23535658503099d5c0e6661fee" UNIQUE ("usename"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "participants" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b77ad0832a0f8ec526c1f40a842" UNIQUE ("email"), CONSTRAINT "REL_1427a77e06023c250ed3794a1b" UNIQUE ("user_id"), CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medias" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "folder_id" uuid NOT NULL, "type" character varying NOT NULL DEFAULT 'other', "path" character varying NOT NULL, "size" bigint NOT NULL, "extension" character varying NOT NULL, "mimetype" character varying NOT NULL, CONSTRAINT "PK_f27321557a66cd4fae9bc1ed6e7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "folders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "parent_id" uuid, CONSTRAINT "PK_8578bd31b0e7f6d6c2480dbbca8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "content" text NOT NULL, "thumbnail_id" uuid NOT NULL, "banner_id" uuid, "is_published" boolean NOT NULL DEFAULT false, "published_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "hashtags" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_7fedde18872deb14e4889361d7b" UNIQUE ("name"), CONSTRAINT "PK_994c5bf9151587560db430018c5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs_hashtags" ("blog_id" uuid NOT NULL, "hashtag_id" uuid NOT NULL, CONSTRAINT "PK_7139f80128810c7bfc7048dc301" PRIMARY KEY ("blog_id", "hashtag_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_887d6215bab25c2170a287bf04" ON "blogs_hashtags" ("blog_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ddfce27035a1f11bddde0ab053" ON "blogs_hashtags" ("hashtag_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" ADD CONSTRAINT "FK_1427a77e06023c250ed3794a1ba" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medias" ADD CONSTRAINT "FK_717efbc32e3c60c6d8932cdc9d3" FOREIGN KEY ("folder_id") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" ADD CONSTRAINT "FK_938a930768697b6ece215667d8e" FOREIGN KEY ("parent_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_abccf5fa2770fcc1fc03889dcbf" FOREIGN KEY ("thumbnail_id") REFERENCES "medias"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_1260ebe48ae2d7c8c2354e404eb" FOREIGN KEY ("banner_id") REFERENCES "medias"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" ADD CONSTRAINT "FK_887d6215bab25c2170a287bf042" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" ADD CONSTRAINT "FK_ddfce27035a1f11bddde0ab0539" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" DROP CONSTRAINT "FK_ddfce27035a1f11bddde0ab0539"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" DROP CONSTRAINT "FK_887d6215bab25c2170a287bf042"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_1260ebe48ae2d7c8c2354e404eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_abccf5fa2770fcc1fc03889dcbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "folders" DROP CONSTRAINT "FK_938a930768697b6ece215667d8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medias" DROP CONSTRAINT "FK_717efbc32e3c60c6d8932cdc9d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "participants" DROP CONSTRAINT "FK_1427a77e06023c250ed3794a1ba"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ddfce27035a1f11bddde0ab053"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_887d6215bab25c2170a287bf04"`,
    );
    await queryRunner.query(`DROP TABLE "blogs_hashtags"`);
    await queryRunner.query(`DROP TABLE "hashtags"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TABLE "folders"`);
    await queryRunner.query(`DROP TABLE "medias"`);
    await queryRunner.query(`DROP TABLE "participants"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
