import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { UserEntity } from '@/dbs/entities';
import { CurrUser, RequiredAuth } from '@/modules/auth/decorators';
import {
  ApiDataPaginatedResponse,
  ApiDataResponse,
  DataResponse,
} from '@/system/response';

import {
  AllRequest,
  HashtagPaginateRequest,
  HashtagRequest,
} from '../requests';
import {
  AllHashtagResponse,
  Hashtag,
  PaginateHashtagResponse,
} from '../responses';
import { HashtagService } from '../services';

@ApiExtraModels(Hashtag)
@ApiTags('[CMS] Hashtag')
@RequiredAuth()
@Controller('hashtags')
export class HashtagController {
  constructor(protected readonly _hashtag_service: HashtagService) {}

  @ApiDataResponse({
    type: 'array',
    items: {
      $ref: getSchemaPath(Hashtag),
    },
  })
  @Get('all')
  async all(@Query() request: AllRequest) {
    return new AllHashtagResponse(await this._hashtag_service.all(request));
  }

  @ApiDataPaginatedResponse(Hashtag)
  @Get('paginate')
  async paginate(@Query() request: HashtagPaginateRequest) {
    return new PaginateHashtagResponse(
      await this._hashtag_service.paginate(request),
    );
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() request: HashtagRequest, @CurrUser() user: UserEntity) {
    const result = await this._hashtag_service.add(request, user);

    return new DataResponse({
      id: result.id,
    });
  }

  @Put('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() request: HashtagRequest,
    @CurrUser() user: UserEntity,
  ) {
    const result = await this._hashtag_service.edit(id, request, user);

    return new DataResponse({
      id: result.id,
    });
  }

  @Delete('remove/:id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this._hashtag_service.remove(id);

    return new DataResponse({
      id: result.id,
    });
  }
}
