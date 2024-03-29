import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { MEDIA_STATUS_ENUM, MEDIA_TYPE_ENUM } from '@/constants';
import { FolderEntity, MediaEntity, UserEntity } from '@/dbs/entities';
import { S3MediaService } from '@/system/s3-media/services';
import { uuid } from '@/utils';

import {
  AllMediaRequest,
  CompleteUploadRequest,
  InitUploadRequest,
  MoveMediaRequest,
  PartUploadRequest,
} from '../requests';
import { getType } from '../utils';

@Injectable()
export class MediaService {
  protected readonly _media_repo: Repository<MediaEntity>;

  protected readonly _folder_repo: Repository<FolderEntity>;

  protected readonly _s3_media_service: S3MediaService;

  constructor(data_source: DataSource, s3_media_service: S3MediaService) {
    this._s3_media_service = s3_media_service;

    this._media_repo = data_source.getRepository(MediaEntity);
    this._folder_repo = data_source.getRepository(FolderEntity);
  }

  async all(request: AllMediaRequest) {
    return this._media_repo.find({
      select: ['id', 'name', 'extension', 'size', 'mimetype', 'path', 'type'],
      where: {
        folder_id: request.folder_id,
        status: MEDIA_STATUS_ENUM.COMPLETED,
      },
    });
  }

  async initUpload(request: InitUploadRequest, creator: UserEntity) {
    const folder = await this._folder_repo.findOneOrFail({
      where: { id: request.folder_id },
    });

    const { bucket_name, type } = await this.getBucket(request.mimetype);

    await this._s3_media_service.getOrCreateBucket(bucket_name);

    const id = uuid();

    const file_name = `${id}.${request.extension}`;

    const uploader = await this._s3_media_service.initMultipartUpload(
      bucket_name,
      file_name,
      request.mimetype,
    );

    await this._media_repo.save(
      this._media_repo.create({
        id,
        folder_id: folder.id,
        upload_id: uploader.UploadId,
        name: request.name,
        extension: request.extension,
        size: request.size,
        mimetype: request.mimetype,
        path: `/${bucket_name}/${file_name}`,
        type,
        created_by: creator.id,
        updated_by: creator.id,
      }),
    );

    return {
      upload_id: uploader.UploadId,
      ...this._s3_media_service.caculator(request.size),
    };
  }

  async partUpload(request: PartUploadRequest) {
    const media = await this._media_repo.findOneOrFail({
      where: { upload_id: request.upload_id },
    });

    const { bucket_name } = await this.getBucket(media.mimetype);

    const part = await this._s3_media_service.partUpload(
      bucket_name,
      `${media.id}.${media.extension}`,
      request.index,
      request.upload_id,
      request.body,
      request.size,
    );

    return {
      e_tag: part.ETag?.replace(/"/g, ''),
      index: request.index,
    };
  }

  async completeUpload(request: CompleteUploadRequest) {
    const media = await this._media_repo.findOneOrFail({
      where: { upload_id: request.upload_id },
    });

    const { bucket_name } = await this.getBucket(media.mimetype);

    const parts = await this._s3_media_service.completeMultipartUpload(
      bucket_name,
      `${media.id}.${media.extension}`,
      request.upload_id,
      request.parts,
    );

    await this._media_repo.update(
      { upload_id: request.upload_id },
      { status: MEDIA_STATUS_ENUM.COMPLETED },
    );

    return {
      parts,
      path: media.path,
      id: media.id,
    };
  }

  async move(request: MoveMediaRequest, updater: UserEntity) {
    const folder = await this._folder_repo.findOneOrFail({
      where: { id: request.folder_id },
    });

    const media = await this._media_repo.findOneOrFail({
      where: { id: request.media_id },
    });

    media.folder_id = folder.id;
    media.updated_by = updater.username;

    return await this._media_repo.save(media);
  }

  async remove(id: string) {
    const media = await this._media_repo.findOneOrFail({ where: { id } });

    const { bucket_name } = await this.getBucket(media.mimetype);

    await this._s3_media_service.removeObject(
      bucket_name,
      `${media.id}.${media.extension}`,
    );

    return await this._media_repo.remove(media);
  }

  async getBucket(mimetype: string) {
    return {
      type: getType(mimetype) as MEDIA_TYPE_ENUM,
      bucket_name: `bucket-${getType(mimetype)}`,
    };
  }
}
