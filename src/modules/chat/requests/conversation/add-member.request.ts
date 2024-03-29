import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsNotEmpty, IsUUID } from 'class-validator';

import { message } from '@/system/validator';

export class AddMemberRequest {
  @ApiProperty({ type: 'string', required: true, isArray: true })
  @ArrayMinSize(1, { message: message.min.number('Thành viên', 2) })
  @IsUUID('4', { each: true, message: message.uuid('Thành viên') })
  @IsNotEmpty({ message: message.required('Thành viên') })
  member_ids!: string[];
}
