import { Body, Controller, Post } from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { UserEntity } from '@/dbs/entities';
import { CurrUser, RequiredAuth } from '@/modules/auth/decorators';
import { ApiDataResponse, DataResponse } from '@/system/response';

import { SendMessageRequest } from '../requests';
import { MessageService } from '../services';

@ApiExtraModels()
@ApiTags('[CMS] Message')
@RequiredAuth()
@Controller('messages')
export class MessageController {
  constructor(protected readonly _message_service: MessageService) {}

  @ApiDataResponse({ type: 'object', properties: { id: { type: 'string' } } })
  @Post('send')
  async send(
    @Body() request: SendMessageRequest,
    @CurrUser() user: UserEntity,
  ) {
    const result = await this._message_service.send(request, user);

    return new DataResponse({
      id: result.id,
    });
  }
}
