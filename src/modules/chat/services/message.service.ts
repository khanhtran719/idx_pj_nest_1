import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import {
  ConversationEntity,
  MediaEntity,
  MessageEntity,
  UserEntity,
} from '@/dbs/entities';
import { ValidationException } from '@/system/exceptions';

import { SendMessageRequest } from '../requests';

@Injectable()
export class MessageService {
  protected readonly _message_repo: Repository<MessageEntity>;

  protected readonly _conversation_repo: Repository<ConversationEntity>;

  protected readonly _media_repo: Repository<MediaEntity>;

  constructor(data_source: DataSource) {
    this._message_repo = data_source.getRepository(MessageEntity);
    this._conversation_repo = data_source.getRepository(ConversationEntity);
    this._media_repo = data_source.getRepository(MediaEntity);
  }

  async send(request: SendMessageRequest, creator: UserEntity) {
    const conversation = await this._conversation_repo.findOneOrFail({
      where: { id: request.conversation_id },
    });

    const medias = request.media_ids?.length
      ? await this._media_repo.find({ where: { id: In(request.media_ids) } })
      : [];

    if (!medias.length && !request.content?.length) {
      throw new ValidationException({
        message: ['Nội dung hoặc media không được để trống'],
        media_ids: ['Nội dung hoặc media không được để trống'],
      });
    }

    const reply_message = request.reply_message_id
      ? await this._message_repo.findOneOrFail({
          where: { id: request.reply_message_id },
        })
      : null;

    const message = this._message_repo.create({
      conversation_id: conversation.id,
      sender_id: creator.id,
      reply_message_id: reply_message.id,
      content: request.content,
      medias,
      created_by: creator.username,
      updated_by: creator.username,
    });

    return await this._message_repo.save(message);
  }
}
