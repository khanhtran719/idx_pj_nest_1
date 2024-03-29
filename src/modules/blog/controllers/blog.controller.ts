import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';

import { UserEntity } from '@/dbs/entities';
import { CurrUser, RequiredAuth } from '@/modules/auth/decorators';
import { ApiDataResponse, DataResponse } from '@/system/response';

import { BlogRequest } from '../requests';
import { BlogService } from '../services';

@ApiExtraModels()
@ApiTags('[CMS] Blog')
@RequiredAuth()
@Controller('blogs')
export class BlogController {
  constructor(protected readonly _blog_service: BlogService) {}

  @ApiDataResponse({ type: 'object', properties: { id: { type: 'string' } } })
  @Post('add')
  async add(@Body() request: BlogRequest, @CurrUser() user: UserEntity) {
    const result = await this._blog_service.add(request, user);

    return new DataResponse({
      id: result.id,
    });
  }

  @ApiDataResponse({ type: 'object', properties: { id: { type: 'string' } } })
  @Put('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() request: BlogRequest,
    @CurrUser() user: UserEntity,
  ) {
    const result = await this._blog_service.edit(id, request, user);

    return new DataResponse({
      id: result.id,
    });
  }

  @ApiDataResponse({ type: 'object', properties: { id: { type: 'string' } } })
  @Delete('remove/:id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this._blog_service.remove(id);

    return new DataResponse({
      id: result.id,
    });
  }
}
