import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

import { DbsConfig, RedisConfig } from '@/config';
import { isProduction } from '@/utils/env';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [RedisConfig, DbsConfig],
      useFactory: async (
        _redis_config: RedisConfig,
        _dbs_config: DbsConfig,
      ): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: _dbs_config.getHost(),
        port: _dbs_config.getPort(),
        username: _dbs_config.getUsername(),
        password: _dbs_config.getPassword(),
        database: _dbs_config.getDatabase(),
        autoLoadEntities: true,
        synchronize: false,
        entities: [join(__dirname, '../../dbs/entities/**/*.entity{.ts,.js}')],
        subscribers: [
          join(__dirname, '../../dbs/subscribers/**/*.subscriber{.ts,.js}'),
        ],
        ssl: !_dbs_config.getSsl()
          ? undefined
          : {
              cert: _dbs_config.getSsl(),
            },
        logging: !isProduction(),
        cache: {
          type: 'ioredis',
          options: {
            host: _redis_config.getHost(),
            port: _redis_config.getPort(),
            username: _redis_config.getUsername(),
            password: _redis_config.getPassword(),
            db: 1,
          },
        },
      }),
    }),
  ],
  providers: [],
  exports: [],
})
export class DbsModule {}
