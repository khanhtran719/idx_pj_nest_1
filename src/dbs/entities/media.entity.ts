import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { MEDIA_STATUS_ENUM, MEDIA_TYPE_ENUM } from '@/constants';

import { BaseEntity } from './base.entity';
import { FolderEntity } from './folder.entity';
import { MessageEntity } from './message.entity';

@Entity('medias')
export class MediaEntity extends BaseEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'name', nullable: false })
  name!: string;

  @Column('varchar', { name: 'upload_id', nullable: false })
  upload_id!: string;

  @Column('uuid', { name: 'folder_id', nullable: false })
  folder_id!: string;

  @Column('varchar', {
    name: 'type',
    nullable: false,
    default: MEDIA_TYPE_ENUM.OTHER,
  })
  type!: MEDIA_TYPE_ENUM;

  @Column('varchar', { name: 'path', nullable: false })
  path!: string;

  @Column('bigint', { name: 'size', nullable: false })
  size!: number;

  @Column('varchar', { name: 'extension', nullable: false })
  extension!: string;

  @Column('varchar', { name: 'mimetype', nullable: false })
  mimetype!: string;

  @Column('varchar', { name: 'status', default: MEDIA_STATUS_ENUM.PENDING })
  status!: MEDIA_STATUS_ENUM;
  // #endregion

  // #region RELATIONS
  @ManyToOne(() => FolderEntity, (folder) => folder.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'folder_id', referencedColumnName: 'id' })
  folder!: Relation<FolderEntity>;

  @ManyToMany(() => MessageEntity, (message) => message.medias, {
    createForeignKeyConstraints: false,
  })
  messages: Relation<MessageEntity>[];
  // #endregion

  //#region OTHERS
  //#endregion
}
