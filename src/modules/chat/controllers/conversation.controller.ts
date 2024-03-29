import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { UserEntity } from '@/dbs/entities';
import { CurrUser, RequiredAuth } from '@/modules/auth/decorators';
import { ApiDataResponse, DataResponse } from '@/system/response';

import { InitConversationRequest } from '../requests';
import { ConversationService } from '../services';

@ApiExtraModels()
@ApiTags('[CMS] Conversation')
@RequiredAuth()
@Controller('conversations')
export class ConversationController {
  constructor(private readonly _conversation_service: ConversationService) {}

  @ApiDataResponse({ type: 'object', properties: { id: { type: 'string' } } })
  @Post('init')
  async init(
    @Body() request: InitConversationRequest,
    @CurrUser() user: UserEntity,
  ) {
    const result = await this._conversation_service.init(request, user);

    return new DataResponse({ id: result.id });
  }
}
