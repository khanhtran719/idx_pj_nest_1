import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { CONVERSATION_TYPE_ENUM } from '@/constants';

import { BaseEntity } from './base.entity';
import { MessageEntity } from './message.entity';
import { UserConversationEntity } from './user-conversation.entity';

@Entity('conversations')
export class ConversationEntity extends BaseEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'name', nullable: true })
  name: string | null;

  @Column('varchar', {
    name: 'type',
    nullable: false,
  })
  type: CONVERSATION_TYPE_ENUM;
  // #endregion

  // #region RELATIONS
  @ManyToOne(
    () => UserConversationEntity,
    (user_conversation) => user_conversation.conversation,
    {
      createForeignKeyConstraints: false,
    },
  )
  users_conversations: Relation<UserConversationEntity>[];

  @ManyToOne(() => MessageEntity, (message) => message.conversation, {
    cascade: true,
  })
  messages: Relation<MessageEntity>[];
  // #endregion
}
