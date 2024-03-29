import {
  CompleteMultipartUploadCommand,
  CreateBucketCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  HeadBucketCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Injectable, Scope } from '@nestjs/common';

import { S3Config } from '@/config';
import { PartSuccessRequest } from '@/modules/media/requests';

@Injectable({ scope: Scope.TRANSIENT })
export class S3MediaService {
  protected readonly _s3_config: S3Config;
  protected readonly _s3_client: S3Client;

  constructor(s3_config: S3Config) {
    this._s3_config = s3_config;
    this._s3_client = new S3Client({
      region: s3_config.getS3Region(),
      credentials: {
        accessKeyId: s3_config.getS3AccessKeyId(),
        secretAccessKey: s3_config.getS3SecretAccessKey(),
      },
      endpoint: s3_config.getEndpoint(),
    });
  }

  async getOrCreateBucket(bucket_name: string) {
    try {
      await this._s3_client.send(
        new HeadBucketCommand({
          Bucket: bucket_name,
        }),
      );
    } catch (err) {
      console.log(err);

      if (err.name === 'NotFound' || err.name === 'NoSuchBucket') {
        await this._s3_client.send(
          new CreateBucketCommand({ Bucket: bucket_name }),
        );
      }
    }
  }

  async initMultipartUpload(
    bucket_name: string,
    file_name: string,
    mimetype: string,
  ) {
    const upload_data = new CreateMultipartUploadCommand({
      Bucket: bucket_name,
      Key: file_name,
      ContentType: mimetype,
    });

    return await this._s3_client.send(upload_data);
  }

  async partUpload(
    bucket_name: string,
    file_name: string,
    part_number: number,
    upload_id: string,
    body: Buffer,
    size: number,
  ) {
    const part_params = new UploadPartCommand({
      Bucket: bucket_name,
      Key: file_name,
      PartNumber: part_number,
      UploadId: upload_id,
      Body: body,
      ContentLength: size,
    });

    return await this._s3_client.send(part_params);
  }

  async completeMultipartUpload(
    bucket_name: string,
    file_name: string,
    upload_id: string,
    parts: PartSuccessRequest[],
  ) {
    return await this._s3_client.send(
      new CompleteMultipartUploadCommand({
        Bucket: bucket_name,
        Key: file_name,
        UploadId: upload_id,
        MultipartUpload: {
          Parts: parts.map((part) => ({
            ETag: part.e_tag,
            PartNumber: part.index,
          })),
        },
      }),
    );
  }

  async removeObject(bucket_name: string, file_name: string) {
    return await this._s3_client.send(
      new DeleteObjectCommand({
        Bucket: bucket_name,
        Key: file_name,
      }),
    );
  }

  caculator(size: number) {
    const number_of_parts = Math.ceil(size / this._s3_config.getMaxSize());

    return {
      number_of_parts,
      part_size:
        number_of_parts === 1 ? Number(size) : this._s3_config.getMaxSize(),
    };
  }
}
