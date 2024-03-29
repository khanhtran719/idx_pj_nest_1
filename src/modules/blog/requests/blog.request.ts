import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { message } from '@/system/validator';

export class BlogRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Tiêu đề') })
  @IsNotEmpty({ message: message.required('Tiêu đề') })
  title!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Mô tả') })
  @IsNotEmpty({ message: message.required('Mô tả') })
  description!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Nội dung') })
  @IsNotEmpty({ message: message.required('Nội dung') })
  content!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsUUID('4', { message: message.uuid('Thumbnail') })
  @IsNotEmpty({ message: message.required('Thumbnail') })
  thumbnail_id!: string;

  @ApiProperty({ type: 'string', required: false })
  @IsUUID('4', { message: message.uuid('Banner') })
  @IsOptional()
  banner_id: string | null;

  @ApiProperty({ type: 'boolean', required: false })
  @IsBoolean({ message: message.boolean('Công khai') })
  @IsNotEmpty({ message: message.required('Công khai') })
  is_published!: boolean;

  @ApiProperty({ type: 'array', items: { type: 'string' }, required: false })
  @IsUUID('4', { each: true, message: message.uuid('Hashtags') })
  @IsOptional()
  hashtags: string[] = [];
}
