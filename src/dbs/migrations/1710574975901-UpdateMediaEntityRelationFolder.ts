import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMediaEntityRelationFolder1710574975901
  implements MigrationInterface
{
  name = 'UpdateMediaEntityRelationFolder1710574975901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medias" DROP CONSTRAINT "FK_717efbc32e3c60c6d8932cdc9d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medias" ADD CONSTRAINT "FK_717efbc32e3c60c6d8932cdc9d3" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medias" DROP CONSTRAINT "FK_717efbc32e3c60c6d8932cdc9d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "medias" ADD CONSTRAINT "FK_717efbc32e3c60c6d8932cdc9d3" FOREIGN KEY ("folder_id") REFERENCES "medias"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
