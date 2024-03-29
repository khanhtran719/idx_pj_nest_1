import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DataSource, Repository } from 'typeorm';

import { MEDIA_STATUS_ENUM } from '@/constants';
import { MediaEntity } from '@/dbs/entities';

@Injectable()
export class MediaJobService {
  protected readonly _logger = new Logger(MediaJobService.name);

  protected readonly _media_repo: Repository<MediaEntity>;

  constructor(data_source: DataSource) {
    this._media_repo = data_source.getRepository(MediaEntity);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clear() {
    this._logger.log('Start clear temp media...');

    const medias = await this._media_repo.find({
      where: { status: MEDIA_STATUS_ENUM.PENDING },
    });

    if (medias.length) {
      await this._media_repo.remove(medias);
    }

    this._logger.log('End clear temp media...');
  }
}
