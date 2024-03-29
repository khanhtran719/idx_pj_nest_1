import { Column, Entity, JoinColumn, ManyToOne, Relation } from 'typeorm';

import { CONVERSATION_ROLE_ENUM } from '@/constants';

import { BaseEntity } from './base.entity';
import { ConversationEntity } from './conversation.entity';
import { UserEntity } from './user.entity';

@Entity('users_conversations')
export class UserConversationEntity extends BaseEntity {
  // #region COLUMNS
  @Column('uuid', { name: 'user_id', nullable: false, primary: true })
  user_id!: string;

  @Column('uuid', { name: 'conversation_id', nullable: false, primary: true })
  conversation_id!: string;

  @Column('varchar', { name: 'nickname', nullable: true })
  nickname: string;

  @Column('varchar', { name: 'role', nullable: false })
  role!: CONVERSATION_ROLE_ENUM;
  // #endregion

  // #region RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: Relation<UserEntity>;

  @ManyToOne(() => ConversationEntity, (conversation) => conversation.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'conversation_id', referencedColumnName: 'id' })
  conversation!: Relation<ConversationEntity>;
  // #endregion

  //#region OTHERS
  //#endregion
}
