import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitChatingDataSystem1711005843911 implements MigrationInterface {
  name = 'InitChatingDataSystem1711005843911';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "messages" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "reply_message_id" uuid, "conversation_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "content" text, "sent_at" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "conversations" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "type" character varying NOT NULL, "participantConversationsParticipantId" uuid, "participantConversationsConversationId" uuid, "messagesId" uuid, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "participant_conversations" ("is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying NOT NULL DEFAULT 'system', "updated_at" TIMESTAMP DEFAULT now(), "updated_by" character varying, "participant_id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "nickname" character varying, "role" character varying NOT NULL, CONSTRAINT "PK_a2c023536cba345e59ff9626d23" PRIMARY KEY ("participant_id", "conversation_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "messages_medias" ("message_id" uuid NOT NULL, "media_id" uuid NOT NULL, CONSTRAINT "PK_5dc8007d463a70d7ac7a9192751" PRIMARY KEY ("message_id", "media_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_15b29360b9bf10829845dd0b1e" ON "messages_medias" ("message_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_47f0fa1b9abcc5871877f360c8" ON "messages_medias" ("media_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_bead535c28ada0b663dc4e99ee6" FOREIGN KEY ("reply_message_id") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23" FOREIGN KEY ("conversation_id") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "participants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD CONSTRAINT "FK_a7ee3807afdadca1a485d370b0c" FOREIGN KEY ("messagesId") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP CONSTRAINT "FK_a7ee3807afdadca1a485d370b0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_3bc55a7c3f9ed54b520bb5cfe23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "messages" DROP CONSTRAINT "FK_bead535c28ada0b663dc4e99ee6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_47f0fa1b9abcc5871877f360c8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_15b29360b9bf10829845dd0b1e"`,
    );
    await queryRunner.query(`DROP TABLE "messages_medias"`);
    await queryRunner.query(`DROP TABLE "participant_conversations"`);
    await queryRunner.query(`DROP TABLE "conversations"`);
    await queryRunner.query(`DROP TABLE "messages"`);
  }
}
