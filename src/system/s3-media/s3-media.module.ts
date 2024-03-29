import { Module } from '@nestjs/common';

import { S3Config } from '@/config';

import { S3MediaService } from './services';

@Module({
  providers: [S3MediaService, S3Config],
  exports: [S3MediaService],
})
export class S3MediaModule {}
