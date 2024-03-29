import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { BaseEntity } from './base.entity';
import { BlogEntity } from './blog.entity';

@Entity('hashtags')
export class HashtagEntity extends BaseEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'name', nullable: false, unique: true })
  name!: string;
  // #endregion

  // #region RELATIONS
  @ManyToMany(() => BlogEntity, (blog) => blog.hashtags, {
    createForeignKeyConstraints: false,
  })
  blogs: Relation<BlogEntity>[];
  // #endregion

  //#region OTHERS
  //#endregion
}
