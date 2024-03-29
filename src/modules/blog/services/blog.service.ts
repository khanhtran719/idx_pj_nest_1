import { Injectable } from '@nestjs/common';
import { DataSource, In, Not, Repository } from 'typeorm';

import { MEDIA_TYPE_ENUM } from '@/constants';
import {
  BlogEntity,
  HashtagEntity,
  MediaEntity,
  UserEntity,
} from '@/dbs/entities';
import { buildPaginateQueryFilter } from '@/system/dbs';
import { ValidationException } from '@/system/exceptions';
import { _slugify } from '@/utils';

import { BlogPaginateRequest, BlogRequest } from '../requests';

@Injectable()
export class BlogService {
  protected readonly _blog_repo: Repository<BlogEntity>;

  protected readonly _media_repo: Repository<MediaEntity>;

  protected readonly _hashtag_repo: Repository<HashtagEntity>;

  constructor(data_source: DataSource) {
    this._blog_repo = data_source.getRepository(BlogEntity);
    this._media_repo = data_source.getRepository(MediaEntity);
    this._hashtag_repo = data_source.getRepository(HashtagEntity);
  }

  async paginate(request: BlogPaginateRequest) {
    const query = this._blog_repo
      .createQueryBuilder('_entity')
      .select([
        '_entity.id',
        '_entity.title',
        '_entity.description',
        '_entity.is_published',
        '_entity.published_at',
        '_entity.updated_at',
        '_entity.created_at',
        '_entity.created_by',
        '_entity.updated_by',

        '_hashtag.id',
        '_hashtag.name',
      ])
      .leftJoin('_entity.hashtags', '_hashtags');

    if (request.is_published === 'published') {
      query.andWhere('_entity.is_published = true');
    } else if (request.is_published === 'unpublish') {
      query.andWhere('_entity.is_published = false');
    }

    return await buildPaginateQueryFilter(query, request, {
      search: ['_entity.title'],
      sort: {
        updated_at: 'DESC',
      },
    });
  }

  async get(id: string) {
    return this._blog_repo
      .createQueryBuilder('_entity')
      .innerJoinAndSelect('_entity.thumbnail', '_thumbnail')
      .leftJoinAndSelect('_entity.banner', '_banner')
      .leftJoinAndSelect('_entity.hashtags', '_hashtags')
      .where('_entity.id = :id', { id })
      .getOneOrFail();
  }

  async add(request: BlogRequest, creator: UserEntity) {
    const slug = _slugify(request.title, { replacement: '-' });

    const blog = await this._blog_repo.findOne({
      where: { slug },
    });
    if (blog) {
      throw new ValidationException({
        title: ['Tiêu đề đã tồn tại'],
      });
    }

    const thumbnail = await this._media_repo.findOneOrFail({
      where: { id: request.thumbnail_id, type: MEDIA_TYPE_ENUM.IMAGE },
    });

    const banner = request.banner_id
      ? await this._media_repo.findOneOrFail({
          where: { id: request.banner_id, type: MEDIA_TYPE_ENUM.IMAGE },
        })
      : null;

    const hashtags = await this._hashtag_repo.findBy({
      id: In(request.hashtags),
    });

    const record = await this._blog_repo.create({
      title: request.title,
      slug,
      description: request.description,
      content: request.content,
      thumbnail,
      banner,
      is_published: request.is_published,
      published_at: request.is_published ? new Date() : null,
      hashtags,
      created_by: creator.username,
      updated_by: creator.username,
    });

    return this._blog_repo.save(record);
  }

  async edit(id: string, request: BlogRequest, editor: UserEntity) {
    const blog = await this._blog_repo.findOneOrFail({
      where: { id },
    });

    const slug = _slugify(request.title, { replacement: '-' });

    const exists = await this._blog_repo.findOne({
      where: { slug, id: Not(id) },
    });
    if (exists) {
      throw new ValidationException({
        title: ['Tiêu đề đã tồn tại'],
      });
    }

    const thumbnail = await this._media_repo.findOneOrFail({
      where: { id: request.thumbnail_id, type: MEDIA_TYPE_ENUM.IMAGE },
    });

    const banner = request.banner_id
      ? await this._media_repo.findOneOrFail({
          where: { id: request.banner_id, type: MEDIA_TYPE_ENUM.IMAGE },
        })
      : null;

    const hashtags = await this._hashtag_repo.findBy({
      id: In(request.hashtags),
    });

    blog.title = request.title;
    blog.slug = slug;
    blog.description = request.description;
    blog.content = request.content;
    blog.thumbnail = thumbnail;
    blog.banner = banner;
    blog.is_published = request.is_published;
    blog.published_at = request.is_published ? new Date() : null;
    blog.hashtags = hashtags;
    blog.updated_by = editor.username;

    return this._blog_repo.save(blog);
  }

  async remove(id: string) {
    const blog = await this._blog_repo.findOneOrFail({
      where: { id },
    });

    return this._blog_repo.remove(blog);
  }
}
