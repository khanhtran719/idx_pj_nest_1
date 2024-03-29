import { Injectable } from '@nestjs/common';
import { DataSource, Not, Repository } from 'typeorm';

import { HashtagEntity, UserEntity } from '@/dbs/entities';
import { buildPaginateQueryFilter } from '@/system/dbs';
import { ValidationException } from '@/system/exceptions';

import {
  AllRequest,
  HashtagPaginateRequest,
  HashtagRequest,
} from '../requests';

@Injectable()
export class HashtagService {
  protected readonly _hashtag_repo: Repository<HashtagEntity>;

  constructor(data_source: DataSource) {
    this._hashtag_repo = data_source.getRepository(HashtagEntity);
  }

  async all(request: AllRequest) {
    return await this._hashtag_repo
      .createQueryBuilder('_hashtag')
      .select(['_hashtag.id', '_hashtag.name'])
      .where('_hashtag.name LIKE :name', {
        name: `%${request.q?.trim() ?? ''}%`,
      })
      .getMany();
  }

  async paginate(request: HashtagPaginateRequest) {
    const query = this._hashtag_repo
      .createQueryBuilder('_hashtag')
      .select([
        '_hashtag.id',
        '_hashtag.name',
        '_hashtag.created_at',

        '_blog.id',
        '_blog.title',
      ])
      .leftJoin('_hashtag.blogs', '_blog');

    return await buildPaginateQueryFilter<HashtagEntity>(query, request, {
      search: ['_hashtag.name'],
      sort: {
        '_hashtag.created_at': 'DESC',
      },
    });
  }

  async add(request: HashtagRequest, creator: UserEntity) {
    if (await this._hashtag_repo.exists({ where: { name: request.name } })) {
      throw new ValidationException({
        name: ['Tên hashtag đã tồn tại'],
      });
    }

    return await this._hashtag_repo.save(
      this._hashtag_repo.create({
        name: request.name,
        created_by: creator.id,
        updated_by: creator.id,
      }),
    );
  }

  async edit(id: string, request: HashtagRequest, updater: UserEntity) {
    let hashtag = await this._hashtag_repo.findOneOrFail({ where: { id } });

    if (hashtag.name !== request.name) {
      if (
        await this._hashtag_repo.exists({
          where: { name: request.name, id: Not(id) },
        })
      ) {
        throw new ValidationException({
          name: ['Tên hashtag đã tồn tại'],
        });
      }

      hashtag.name = request.name;
      hashtag.updated_by = updater.id;
      hashtag = await this._hashtag_repo.save(hashtag);
    }

    return hashtag;
  }

  async remove(id: string) {
    const hashtag = await this._hashtag_repo.findOneOrFail({
      where: { id },
      relations: {
        blogs: true,
      },
    });

    if (hashtag.blogs?.length) {
      throw new ValidationException({
        id: ['Hashtag đang được sử dụng'],
      });
    }

    return await this._hashtag_repo.remove(hashtag);
  }
}
