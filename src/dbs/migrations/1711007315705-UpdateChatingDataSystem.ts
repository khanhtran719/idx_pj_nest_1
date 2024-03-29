import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateChatingDataSystem1711007315705
  implements MigrationInterface
{
  name = 'UpdateChatingDataSystem1711007315705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_conversations" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "user_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "nickname" character varying, "role" character varying NOT NULL, CONSTRAINT "PK_e5c49a6d4a4a1df37e8b0f84f38" PRIMARY KEY ("user_id", "conversation_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP COLUMN "participantConversationsParticipantId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP COLUMN "participantConversationsConversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD "usersConversationsUserId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD "usersConversationsConversationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP COLUMN "usersConversationsConversationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP COLUMN "usersConversationsUserId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD "participantConversationsConversationId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD "participantConversationsParticipantId" uuid`,
    );
    await queryRunner.query(`DROP TABLE "users_conversations"`);
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
