import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { message } from '@/system/validator';

export class SignUpRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Fullname') })
  @IsNotEmpty({ message: message.required('Fullname') })
  fullname!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Username') })
  @IsNotEmpty({ message: message.required('Username') })
  username!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Password') })
  @IsNotEmpty({ message: message.required('Password') })
  password!: string;

  @ApiProperty({ type: 'string', required: true })
  @IsString({ message: message.string('Email') })
  @IsNotEmpty({ message: message.required('Email') })
  email!: string;
}
