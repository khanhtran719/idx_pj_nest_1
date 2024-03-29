import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { message } from '@/system/validator';

export class PartUploadRequest {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty({ message: message.required('Body') })
  body!: Buffer;

  @ApiProperty({ type: 'number', required: true })
  @IsNotEmpty({ message: message.required('Part Number') })
  index!: number;

  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty({ message: message.required('Upload Id') })
  upload_id!: string;

  @ApiProperty({ type: 'number', required: true })
  @IsNotEmpty({ message: message.required('Size') })
  size!: number;
}
