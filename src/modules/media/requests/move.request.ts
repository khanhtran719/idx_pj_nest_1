import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { message } from '@/system/validator';

export class MoveMediaRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsUUID('4', { message: message.uuid('Media') })
  @IsNotEmpty({ message: message.required('Media') })
  media_id!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsUUID('4', { message: message.uuid('Folder') })
  @IsNotEmpty({ message: message.required('Folder') })
  folder_id!: string;
}
