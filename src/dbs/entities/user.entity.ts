import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { ROLE_TYPE_ENUM } from '@/constants';

import { BaseEntity } from './base.entity';
import { UserConversationEntity } from './user-conversation.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'usename', nullable: false, unique: true })
  username!: string;

  @Column('varchar', { name: 'fullname', nullable: false })
  fullname!: string;

  @Column('varchar', { name: 'password', nullable: false })
  password!: string;

  @Column('varchar', { name: 'email', nullable: false, unique: true })
  email!: string;

  @Column('varchar', { name: 'type', default: ROLE_TYPE_ENUM.USER })
  type!: ROLE_TYPE_ENUM;
  //#endregion

  //#region RELATIONS
  @OneToMany(
    () => UserConversationEntity,
    (user_conversation) => user_conversation.user,
    {
      createForeignKeyConstraints: false,
    },
  )
  users_conversations: Relation<UserConversationEntity>[];
  //#endregion

  //#region OTHERS
  //#endregion
}
