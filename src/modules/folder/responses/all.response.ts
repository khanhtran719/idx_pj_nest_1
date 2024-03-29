import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance, Transform } from 'class-transformer';

import { FolderEntity } from '@/dbs/entities';
import { DataResponse } from '@/system/response';

export class Folder {
  @ApiProperty({ type: 'string', required: true })
  @Transform(({ obj }: { obj: FolderEntity }) => obj.id)
  @Expose()
  id!: string;

  @ApiProperty({ type: 'string', required: true })
  @Transform(({ obj }: { obj: FolderEntity }) => obj.name)
  @Expose()
  name!: string;
}

export class AllFolderResponse extends DataResponse<Folder[]> {
  constructor(folders: FolderEntity[]) {
    super(plainToInstance(Folder, folders, { excludeExtraneousValues: true }));
  }
}
