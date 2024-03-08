import { app_config, AppConfig } from './app.config';
import { dbs_config, DbsConfig } from './dbs.config';
import { redis_config, RedisConfig } from './redis.config';
import { s3_config, S3Config } from './s3.config';

export const configs = [app_config, dbs_config, redis_config, s3_config];

export const services = [AppConfig, DbsConfig, RedisConfig, S3Config];

export {
  app_config,
  AppConfig,
  dbs_config,
  DbsConfig,
  redis_config,
  RedisConfig,
  s3_config,
  S3Config,
};
