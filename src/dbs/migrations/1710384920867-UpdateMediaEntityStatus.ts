import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMediaEntityStatus1710384920867
  implements MigrationInterface
{
  name = 'UpdateMediaEntityStatus1710384920867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" DROP CONSTRAINT "FK_887d6215bab25c2170a287bf042"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" DROP CONSTRAINT "FK_ddfce27035a1f11bddde0ab0539"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medias" ADD "status" character varying NOT NULL DEFAULT 'pending'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "medias" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" ADD CONSTRAINT "FK_ddfce27035a1f11bddde0ab0539" FOREIGN KEY ("hashtag_id") REFERENCES "hashtags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs_hashtags" ADD CONSTRAINT "FK_887d6215bab25c2170a287bf042" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
