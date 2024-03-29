import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateMediaEntityUploadIdMultipart1710574563150
  implements MigrationInterface
{
  name = 'UpdateMediaEntityUploadIdMultipart1710574563150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medias" ADD "upload_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "medias" DROP COLUMN "upload_id"`);
  }
}
