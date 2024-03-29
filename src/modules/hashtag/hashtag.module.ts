import { Module } from '@nestjs/common';

import { CacheModule } from '@/system/cache';

import { HashtagController } from './controllers';
import { HashtagService } from './services';

@Module({
  imports: [CacheModule],
  controllers: [HashtagController],
  providers: [HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
