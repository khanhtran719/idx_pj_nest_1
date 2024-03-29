import { Injectable } from '@nestjs/common';
import { DataSource, Not, Repository } from 'typeorm';

import { FolderEntity } from '@/dbs/entities';
import { ValidationException } from '@/system/exceptions';

import { FolderRequest } from '../requests';

@Injectable()
export class FolderService {
  protected readonly _folder_repo: Repository<FolderEntity>;

  constructor(data_source: DataSource) {
    this._folder_repo = data_source.getRepository(FolderEntity);
  }

  async all() {
    return await this._folder_repo.find();
  }

  async add(request: FolderRequest) {
    if (
      await this._folder_repo.exists({
        where: { name: request.name, parent_id: request.parent_id ?? null },
      })
    ) {
      throw new ValidationException({
        name: ['Tên thư mục đã tồn tại'],
      });
    }

    return await this._folder_repo.save(
      this._folder_repo.create({
        name: request.name,
        parent_id: request.parent_id ?? null,
      }),
    );
  }

  async edit(id: string, request: FolderRequest) {
    let folder = await this._folder_repo.findOneOrFail({ where: { id } });

    if (folder.name !== request.name) {
      if (
        await this._folder_repo.exists({
          where: {
            name: request.name,
            parent_id: folder.parent_id ?? null,
            id: Not(id),
          },
        })
      ) {
        throw new ValidationException({
          name: ['Tên thư mục đã tồn tại'],
        });
      }

      folder.name = request.name;
      folder.parent_id = request.parent_id ?? null;

      folder = await this._folder_repo.save(folder);
    }

    return folder;
  }

  async remove(id: string) {
    const folder = await this._folder_repo.findOneOrFail({
      where: { id },
      relations: {
        childrens: true,
        medias: true,
      },
    });

    if (folder.childrens?.length || folder.medias?.length) {
      throw new ValidationException({
        id: ['Thư mục này không thể xóa vì còn chứa thư mục con hoặc media.'],
      });
    }

    return await this._folder_repo.remove(folder);
  }
}
