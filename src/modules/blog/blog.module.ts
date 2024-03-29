import { Module } from '@nestjs/common';

import { CacheModule } from '@/system/cache';

import { BlogController } from './controllers';
import { BlogService } from './services';

@Module({
  imports: [CacheModule],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
