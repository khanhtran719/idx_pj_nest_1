import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { MEDIA_TYPE_ENUM } from '@/constants';
import { MediaEntity } from '@/dbs/entities';
import { DataResponse } from '@/system/response';

export class Media {
  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.id)
  @Expose()
  id!: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.name)
  @Expose()
  name!: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.extension)
  @Expose()
  extension!: string;

  @ApiProperty({ type: 'number' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.size)
  @Expose()
  size!: number;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.mimetype)
  @Expose()
  mimetype!: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.path)
  @Expose()
  path!: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: MediaEntity }) => obj.type)
  @Expose()
  type!: MEDIA_TYPE_ENUM;
}

export class AllMediasResponse extends DataResponse<Media[]> {
  constructor(medias: MediaEntity[]) {
    super(plainToInstance(Media, medias, { excludeExtraneousValues: true }));
  }
}
