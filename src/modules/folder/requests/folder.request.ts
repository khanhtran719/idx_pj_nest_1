import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { message } from '@/system/validator';

export class FolderRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Tên thư mục') })
  @IsNotEmpty({ message: message.required('Tên thư mục') })
  name!: string;

  @ApiProperty({ type: 'string', required: false })
  @IsUUID('4', { message: message.uuid('Thư mục cha') })
  @IsOptional()
  parent_id: string;
}
