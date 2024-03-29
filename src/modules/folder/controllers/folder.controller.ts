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
} from '@nestjs/common';
import { ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';

import { RequiredAuth } from '@/modules/auth/decorators';
import { ApiDataResponse, DataResponse } from '@/system/response';

import { FolderRequest } from '../requests';
import { AllFolderResponse, Folder } from '../responses';
import { FolderService } from '../services';

@ApiExtraModels(Folder)
@ApiTags('[CMS] Folder')
@RequiredAuth()
@Controller('folders')
export class FolderController {
  constructor(protected readonly _folder_service: FolderService) {}

  @ApiDataResponse({
    type: 'array',
    items: {
      $ref: getSchemaPath(Folder),
    },
  })
  @Get('all')
  async all() {
    return new AllFolderResponse(await this._folder_service.all());
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async add(@Body() request: FolderRequest) {
    const result = await this._folder_service.add(request);

    return new DataResponse({
      id: result.id,
    });
  }

  @Put('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() request: FolderRequest,
  ) {
    const result = await this._folder_service.edit(id, request);

    return new DataResponse({
      id: result.id,
    });
  }

  @Delete('remove/:id')
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    const result = await this._folder_service.remove(id);

    return new DataResponse({
      id: result.id,
    });
  }
}
