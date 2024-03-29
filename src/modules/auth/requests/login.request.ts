import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { message } from '@/system/validator';

export class LoginRequest {
  @ApiProperty({ type: 'string', example: 'admin' })
  @IsString({ message: message.string('Tên đăng nhập') })
  @IsNotEmpty({ message: message.required('Tên đăng nhập') })
  username!: string;

  @ApiProperty({ type: 'string', example: '12345' })
  @IsString({ message: message.string('Mật khẩu') })
  @IsNotEmpty({ message: message.required('Mật khẩu') })
  password!: string;
}
