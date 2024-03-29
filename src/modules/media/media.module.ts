import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { CacheModule } from '@/system/cache';
import { S3MediaModule } from '@/system/s3-media';

import { MediaController } from './controllers';
import { MediaJobService, MediaService } from './services';

@Module({
  imports: [ScheduleModule.forRoot(), CacheModule, S3MediaModule],
  controllers: [MediaController],
  providers: [MediaService, MediaJobService],
  exports: [MediaService, MediaJobService],
})
export class MediaModule {}
