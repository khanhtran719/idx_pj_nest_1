import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

import { message } from '@/system/validator';

export class PartSuccessRequest {
  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty({ message: message.required('Part Number') })
  index!: number;

  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty({ message: message.required('E_tag') })
  e_tag!: string;
}

export class CompleteUploadRequest {
  @ApiProperty({ type: PartSuccessRequest, required: true })
  @ValidateNested({ each: true })
  @Type(() => PartSuccessRequest)
  @IsArray({ message: message.array('Parts') })
  @IsNotEmpty({ message: message.required('Parts') })
  parts!: PartSuccessRequest[];

  @ApiProperty({ type: 'string', required: true })
  @IsNotEmpty({ message: message.required('Upload Id') })
  upload_id!: string;
}
