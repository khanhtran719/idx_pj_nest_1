import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { HashtagEntity } from '@/dbs/entities';
import { LengthAwarePaginator } from '@/system/dbs';
import { DataPaginatedResponse, DataResponse } from '@/system/response';

export class Hashtag {
  @ApiProperty({ type: 'string', required: true })
  @Transform(({ obj }: { obj: HashtagEntity }) => obj.id)
  @Expose()
  id!: string;

  @ApiProperty({ type: 'string', required: true })
  @Transform(({ obj }: { obj: HashtagEntity }) => obj.name)
  @Expose()
  name!: string;

  @ApiProperty({ type: 'array', items: { type: 'string' } })
  @Transform(
    ({ obj }: { obj: HashtagEntity }) =>
      obj.blogs?.map((blog) => blog.title) ?? null,
  )
  @Expose()
  blogs: string[] | null;
}

export class PaginateHashtagResponse extends DataPaginatedResponse<Hashtag> {
  constructor({ items, ...metadata }: LengthAwarePaginator<HashtagEntity>) {
    super({
      items: plainToInstance(Hashtag, items, { excludeExtraneousValues: true }),
      ...metadata,
    });
  }
}

export class AllHashtagResponse extends DataResponse<Hashtag[]> {
  constructor(items: HashtagEntity[]) {
    super(plainToInstance(Hashtag, items, { excludeExtraneousValues: true }));
  }
}
