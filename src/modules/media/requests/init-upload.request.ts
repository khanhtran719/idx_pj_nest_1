import { ApiProperty } from '@nestjs/swagger';
import { IsMimeType, IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { message } from '@/system/validator';

export class InitUploadRequest {
  @ApiProperty({ type: 'string', required: false })
  @IsUUID('4', { message: message.uuid('Thư mục chứa file') })
  @IsNotEmpty({ message: message.required('Thư mục chứa file') })
  folder_id!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsMimeType({ message: message.invalid('Mimetype') })
  @IsNotEmpty({ message: message.required('Mimetype') })
  mimetype!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Tên file') })
  @IsNotEmpty({ message: message.required('Tên file') })
  name!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Extension') })
  @IsNotEmpty({ message: message.required('Extension') })
  extension!: string;

  @ApiProperty({ type: 'number', required: true })
  @IsNotEmpty({ message: message.required('Kích thước file') })
  size!: number;
}
