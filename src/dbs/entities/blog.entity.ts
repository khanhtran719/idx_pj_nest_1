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
import { HashtagEntity } from './hashtag.entity';
import { MediaEntity } from './media.entity';

@Entity('blogs')
export class BlogEntity extends BaseEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'title', nullable: false })
  title!: string;

  @Column('varchar', { name: 'slug', nullable: false, unique: true })
  slug!: string;

  @Column('varchar', { name: 'description', nullable: false })
  description!: string;

  @Column('text', { name: 'content', nullable: false })
  content!: string;

  @Column('uuid', { name: 'thumbnail_id', nullable: false })
  thumbnail_id!: string;

  @Column('uuid', { name: 'banner_id', nullable: true })
  banner_id: string | null;

  @Column('boolean', { name: 'is_published', default: false })
  is_published!: boolean;

  @Column('timestamp', {
    name: 'published_at',
    nullable: false,
    default: () => 'now()',
  })
  published_at!: Date;
  // #endregion

  // #region RELATIONS
  @ManyToOne(() => MediaEntity, (media) => media.id, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'thumbnail_id', referencedColumnName: 'id' })
  thumbnail: Relation<MediaEntity>;

  @ManyToOne(() => MediaEntity, (media) => media.id, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'banner_id', referencedColumnName: 'id' })
  banner: Relation<MediaEntity> | null;

  @ManyToMany(() => HashtagEntity, (hashtag) => hashtag.blogs, {
    createForeignKeyConstraints: false,
  })
  @JoinTable({
    name: 'blogs_hashtags',
    joinColumn: { name: 'blog_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'hashtag_id', referencedColumnName: 'id' },
  })
  hashtags: Relation<HashtagEntity>[];
  // #endregion

  // #region OTHERS
  // #endregion
}
