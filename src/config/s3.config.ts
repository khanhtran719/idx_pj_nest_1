import { Inject, Injectable } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

const NAME_CONFIG = 's3';

export const s3_config = registerAs(NAME_CONFIG, () => ({
  s3_region: process.env.S3_REGION ?? 'ap-southeast-1',
  s3_account_id: process.env.S3_ACCOUNT_ID ?? undefined,
  s3_access_key_id: process.env.S3_ACCESS_KEY_ID ?? undefined,
  s3_secret_access_key: process.env.S3_SECRET_ACCESS_KEY ?? undefined,

  r2_bucket_url: process.env.R2_BUCKET_URL ?? undefined,

  enpoint: `https://${process.env.S3_ACCOUNT_ID}.r2.cloudflarestorage.com`,

  max_size: 1024 * 1024 * 10, // 10MB
}));

@Injectable()
export class S3Config {
  constructor(
    @Inject(s3_config.KEY)
    protected readonly config: ConfigType<typeof s3_config>,
  ) {}

  getS3Region(): string {
    return this.config.s3_region;
  }

  getS3AccountId(): string | undefined {
    return this.config.s3_account_id;
  }

  getS3AccessKeyId(): string | undefined {
    return this.config.s3_access_key_id;
  }

  getS3SecretAccessKey(): string | undefined {
    return this.config.s3_secret_access_key;
  }

  getR2BucketUrl(): string | undefined {
    return this.config.r2_bucket_url;
  }

  getEndpoint(): string {
    return this.config.enpoint;
  }

  getMaxSize(): number {
    return this.config.max_size;
  }
}
