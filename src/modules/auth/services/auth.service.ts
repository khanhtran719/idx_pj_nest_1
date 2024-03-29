import { Injectable, UnauthorizedException } from '@nestjs/common';
import ms from 'ms';
import { DataSource, Repository } from 'typeorm';

import { AuthConfig } from '@/config';
import { ROLE_TYPE_ENUM } from '@/constants';
import { SessionEntity, UserEntity } from '@/dbs/entities';
import { CacheService } from '@/system/cache';
import { ValidationException } from '@/system/exceptions';
import { uuid } from '@/utils';

import { IPayloadToken } from '../interfaces';
import { LoginRequest, SignUpRequest } from '../requests';
import {
  _compare,
  _hash,
  generateTokensPair,
  readOrCreateUserKey,
} from '../utils';

@Injectable()
export class AuthService {
  protected readonly _auth_config: AuthConfig;
  protected readonly _cache_service: CacheService;

  protected readonly _user_repo: Repository<UserEntity>;
  protected readonly _session_repo: Repository<SessionEntity>;

  constructor(
    data_source: DataSource,
    cache_service: CacheService,
    auth_config: AuthConfig,
  ) {
    this._auth_config = auth_config;
    this._cache_service = cache_service;

    this._user_repo = data_source.getRepository(UserEntity);
    this._session_repo = data_source.getRepository(SessionEntity);
  }

  async login(request: LoginRequest) {
    const user = await this._user_repo
      .createQueryBuilder('_entity')
      .where('_entity.username = :username', { username: request.username })
      .orWhere('_entity.email = :email', { email: request.username })
      .getOne();

    if (!user || !(await _compare(request.password, user.password)))
      throw new UnauthorizedException();

    const { private_key, public_key } = readOrCreateUserKey(user.id);
    const time_expire = this.getTokenExpireConfig();
    const auth_id = uuid();

    const payload: IPayloadToken = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      type: user.type,
      id: `auth:${auth_id}`,
    };
    const { access_token, refresh_token } = await generateTokensPair(
      payload,
      private_key,
      public_key,
      time_expire,
    );

    await this._cache_service.set(payload.id, payload, time_expire);
    await this._session_repo.insert({
      id: auth_id,
      user_id: user.id,
      access_token,
      refresh_token,
    });

    return { access_token, refresh_token };
  }

  async signUp(request: SignUpRequest) {
    if (
      await this._user_repo.exists({
        where: { username: request.username },
      })
    )
      throw new ValidationException({ username: ['Tên tài khoản đã tồn tại'] });

    if (
      await this._user_repo.exists({
        where: { email: request.email },
      })
    )
      throw new ValidationException({ email: ['Email đã tồn tại'] });

    return await this._user_repo.save(
      this._user_repo.create({
        username: request.username,
        email: request.email,
        fullname: request.fullname,
        password: await _hash(request.password),
        type: ROLE_TYPE_ENUM.USER,
      }),
    );
  }

  async logout(session: SessionEntity) {
    await this._session_repo.update(session.id, {
      logout_at: new Date(),
    });

    await this._cache_service.del(`auth:${session.id}`);
  }

  getByUsername(username: string) {
    return this._user_repo.findOne({ where: { username } });
  }

  getSessionByToken(access_token: string) {
    return this._session_repo.findOne({ where: { access_token } });
  }

  getTokenExpireConfig() {
    return ms(this._auth_config.getTokenExpires()) / 1000;
  }
}
