import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { message } from '@/system/validator';

export class AllMediaRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsUUID('4', { message: message.uuid('Folder Id') })
  @IsNotEmpty({ message: message.required('Folder Id') })
  folder_id!: string;
}
