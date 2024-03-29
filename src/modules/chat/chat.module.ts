import { Module } from '@nestjs/common';

import { CacheModule } from '@/system/cache';

import { ConversationController, MessageController } from './controllers';
import { ConversationService, MessageService } from './services';

@Module({
  imports: [CacheModule],
  controllers: [ConversationController, MessageController],
  providers: [ConversationService, MessageService],
  exports: [ConversationService, MessageService],
})
export class ChatModule {}
