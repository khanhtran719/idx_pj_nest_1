import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

import { CONVERSATION_TYPE_ENUM, CONVERSATION_TYPES } from '@/constants';
import { message } from '@/system/validator';

export class InitConversationRequest {
  @ApiProperty({ type: 'string', isArray: true, required: true })
  @ArrayMinSize(1, { message: message.min.number('Thành viên', 2) })
  @IsUUID('4', { each: true, message: message.uuid('Thành viên') })
  @IsNotEmpty({ message: message.required('Thành viên') })
  member_ids!: string[];

  @ApiProperty({ type: 'string', enum: CONVERSATION_TYPES, required: true })
  @IsNotEmpty({ message: message.required('Loại hội thoại') })
  type!: CONVERSATION_TYPE_ENUM;

  @ApiProperty({ type: 'string', required: false })
  @IsString({ message: message.string('Tên hội thoại') })
  @IsOptional()
  name: string;
}
