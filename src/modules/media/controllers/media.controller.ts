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
import { ApiDataResponse, DataResponse } from '@/system/response';

import {
  AllMediaRequest,
  CompleteUploadRequest,
  InitUploadRequest,
  MoveMediaRequest,
  PartUploadRequest,
} from '../requests';
import { AllMediasResponse, Media } from '../responses';
import { MediaService } from '../services';

@ApiExtraModels()
@ApiTags('[CMS] Media')
@RequiredAuth()
@Controller('medias')
export class MediaController {
  constructor(protected readonly _media_service: MediaService) {}

  @ApiDataResponse({
    type: 'array',
    items: {
      $ref: getSchemaPath(Media),
    },
  })
  @Get('all')
  async all(@Query() request: AllMediaRequest) {
    return new AllMediasResponse(await this._media_service.all(request));
  }

  @ApiDataResponse({
    type: 'object',
    properties: {
      upload_id: { type: 'string' },
      part_number: { type: 'number' },
      number_of_parts: { type: 'number' },
    },
  })
  @Post('init-upload')
  @HttpCode(HttpStatus.CREATED)
  async initUpload(
    @Body() request: InitUploadRequest,
    @CurrUser() user: UserEntity,
  ) {
    return new DataResponse(
      await this._media_service.initUpload(request, user),
    );
  }

  @ApiDataResponse({
    type: 'object',
    properties: { e_tag: { type: 'string' }, index: { type: 'number' } },
  })
  @Put('part-upload')
  async partUpload(@Body() request: PartUploadRequest) {
    return new DataResponse(await this._media_service.partUpload(request));
  }

  @ApiDataResponse({
    type: 'object',
    properties: {
      parts: { type: 'any' },
      path: { type: 'string' },
      id: { type: 'string' },
    },
  })
  @Put('complete-upload')
  async completeUpload(@Body() request: CompleteUploadRequest) {
    return new DataResponse(await this._media_service.completeUpload(request));
  }

  @ApiDataResponse({ type: 'object', properties: { id: { type: 'string' } } })
  @Put('move')
  async move(@Body() request: MoveMediaRequest, @CurrUser() user: UserEntity) {
    const result = await this._media_service.move(request, user);

    return new DataResponse({
      id: result.id,
    });
  }

  @Delete('remove/:id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this._media_service.remove(id);

    return new DataResponse({
      id: result.id,
    });
  }
}
