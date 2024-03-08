import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { MediaEntity } from './media.entity';

@Entity('folders')
export class FolderEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'name', nullable: false })
  name!: string;

  @Column('uuid', { name: 'parent_id', nullable: true })
  parent_id: string | null;
  // #endregion

  // #region RELATIONS
  @ManyToOne(() => FolderEntity, (folder) => folder.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent: Relation<FolderEntity> | null;

  @OneToMany(() => FolderEntity, (folder) => folder.parent, {
    cascade: true,
  })
  children: Relation<FolderEntity>[];

  @OneToMany(() => MediaEntity, (media) => media.folder, {
    cascade: true,
  })
  medias: Relation<MediaEntity>[];
  // #endregion

  // #region OTHERS
  // #endregion
}
