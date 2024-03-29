import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { PaginateFilterRequest } from '@/system/dbs';
import { message } from '@/system/validator';

export class BlogPaginateRequest extends PaginateFilterRequest {
  @ApiProperty({
    type: 'string',
    required: false,
    enum: ['published', 'unpublish'],
  })
  @IsString({ message: message.string('Công khai') })
  @IsOptional()
  is_published?: 'published' | 'unpublish';
}
