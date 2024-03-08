import { Module } from '@nestjs/common';

import { ConfigModule } from '@/system/config';
import { DbsModule } from '@/system/dbs';
import { LogModule } from '@/system/log';

@Module({
  imports: [ConfigModule, LogModule, DbsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
