import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { message } from '@/system/validator';

export class HashtagRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Tên hashtag') })
  @IsNotEmpty({ message: message.required('Tên hashtag') })
  name!: string;
}
