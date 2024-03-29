import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToClass, Transform } from 'class-transformer';

import { ROLE_TYPE_ENUM } from '@/constants';
import { UserEntity } from '@/dbs/entities';
import { DataResponse } from '@/system/response';

export class Profile {
  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: UserEntity }) => obj.id)
  @Expose()
  id: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: UserEntity }) => obj.username)
  @Expose()
  username: string;

  @ApiProperty({ type: 'string' })
  @Transform(({ obj }: { obj: UserEntity }) => obj.email)
  @Expose()
  email: string;

  @ApiProperty({ type: 'string', enum: ROLE_TYPE_ENUM })
  @Transform(({ obj }: { obj: UserEntity }) => obj.type)
  @Expose()
  type: ROLE_TYPE_ENUM;
}

export class ProfileResponse extends DataResponse<Profile> {
  constructor(user: UserEntity) {
    super(plainToClass(Profile, user, { excludeExtraneousValues: true }));
  }
}
