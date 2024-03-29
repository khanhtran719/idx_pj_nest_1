import { Module } from '@nestjs/common';

import { CacheModule } from '@/system/cache';

import { FolderController } from './controllers';
import { FolderService } from './services';

@Module({
  imports: [CacheModule],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
