import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { MEDIA_TYPE_ENUM } from '@/constants/enums/media-type.enum';

import { BaseEntity } from './base.entity';

@Entity('medias')
export class MediaEntity extends BaseEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'name', nullable: false })
  name!: string;

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
  // #endregion

  // #region RELATIONS
  @ManyToOne(() => MediaEntity, (media) => media.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'folder_id', referencedColumnName: 'id' })
  folder!: MediaEntity;
  // #endregion

  //#region OTHERS
  //#endregion
}
