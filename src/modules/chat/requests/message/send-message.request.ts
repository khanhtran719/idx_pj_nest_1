import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

import { message } from '@/system/validator';

export class SendMessageRequest {
  @ApiProperty({ type: 'string', required: false })
  @IsString({ message: message.string('Nội dung') })
  @IsOptional()
  content: string;

  @ApiProperty({ type: 'string', required: true })
  @IsUUID('4', { message: message.uuid('Đoạn hội thoại') })
  @IsNotEmpty({ message: message.required('Đoạn hội thoại') })
  conversation_id!: string;

  @ApiProperty({ type: 'string', isArray: true, required: false })
  @IsUUID('4', { each: true, message: message.uuid('Media file') })
  @IsOptional()
  media_ids: string[];

  @ApiProperty({ type: 'string', required: false })
  @IsString({ message: message.string('Trả lời') })
  @IsOptional()
  reply_message_id: string;
}
