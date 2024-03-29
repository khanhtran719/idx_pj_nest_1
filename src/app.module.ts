import { Module } from '@nestjs/common';

import { CacheModule } from '@/system/cache';
import { ConfigModule } from '@/system/config';
import { DbsModule } from '@/system/dbs';
import { LogModule } from '@/system/log';

import { modules } from './modules';
import { S3MediaModule } from './system/s3-media';

@Module({
  imports: [
    ConfigModule,
    CacheModule,
    LogModule,
    DbsModule,
    S3MediaModule,
    ...modules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
