import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { Response } from 'express';
import ms from 'ms';

import { AuthConfig } from '@/config';
import { SessionEntity, UserEntity } from '@/dbs/entities';
import { ApiDataResponse, DataResponse } from '@/system/response';

import { CurrSession, CurrUser, RequiredAuth } from '../decorators';
import { LoginRequest, SignUpRequest } from '../requests';
import { Profile, ProfileResponse } from '../responses';
import { AuthService } from '../services';

@ApiExtraModels(Profile)
@ApiTags('[CMS] Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth_service: AuthService,
    private readonly auth_config: AuthConfig,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.NO_CONTENT)
  async login(
    @Body() request: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, refresh_token } = await this.auth_service.login(
      request,
    );

    response.cookie(this.auth_config.getAccessCookieName(), access_token, {
      httpOnly: true,
      maxAge: ms(this.auth_config.getTokenExpires()),
    }); // 1 days

    response.cookie(this.auth_config.getRefreshCookieName(), refresh_token, {
      httpOnly: true,
      maxAge: ms(this.auth_config.getTokenExpires()) * 7,
    }); // 7 days
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() request: SignUpRequest) {
    const result = await this.auth_service.signUp(request);

    return new DataResponse({
      id: result.id,
    });
  }

  @ApiDataResponse({ $ref: getSchemaPath(Profile) })
  @RequiredAuth()
  @Get('profile')
  async me(@CurrUser() user: UserEntity) {
    return new ProfileResponse(user);
  }

  @RequiredAuth()
  @Get('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrSession() session: SessionEntity,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (session) await this.auth_service.logout(session);

    response.clearCookie(this.auth_config.getAccessCookieName());
    response.clearCookie(this.auth_config.getRefreshCookieName());
  }
}
