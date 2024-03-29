import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { ConversationEntity } from './conversation.entity';
import { MediaEntity } from './media.entity';
import { UserEntity } from './user.entity';

@Entity('messages')
export class MessageEntity extends BaseEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('uuid', { name: 'reply_message_id', nullable: true })
  reply_message_id: string;

  @Column('uuid', { name: 'conversation_id', nullable: false })
  conversation_id!: string;

  @Column('uuid', { name: 'sender_id', nullable: false })
  sender_id!: string;

  @Column('text', { name: 'content', nullable: true })
  content: string;

  @Column('timestamp', { name: 'sent_at', default: () => 'NOW()' })
  send_at!: Date;
  // #endregion

  // #region RELATIONS
  @ManyToMany(() => MediaEntity, (media) => media.messages, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'messages_medias',
    joinColumn: { name: 'message_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'media_id', referencedColumnName: 'id' },
  })
  medias: Relation<MediaEntity>[];

  @ManyToOne(() => MessageEntity, (message) => message.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reply_message_id', referencedColumnName: 'id' })
  reply_message: Relation<MessageEntity>;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'conversation_id', referencedColumnName: 'id' })
  conversation: Relation<ConversationEntity>;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'sender_id', referencedColumnName: 'id' })
  sender: Relation<UserEntity>;
  // #endregion

  //#region OTHERS
  //#endregion
}
