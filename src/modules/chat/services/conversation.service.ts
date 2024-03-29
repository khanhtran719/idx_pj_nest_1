import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';

import { CONVERSATION_ROLE_ENUM } from '@/constants';
import {
  ConversationEntity,
  UserConversationEntity,
  UserEntity,
} from '@/dbs/entities';

import { AddMemberRequest, InitConversationRequest } from '../requests';

@Injectable()
export class ConversationService {
  protected readonly _conversation_repo: Repository<ConversationEntity>;

  protected readonly _user_repo: Repository<UserEntity>;

  protected readonly _user_conversation_repo: Repository<UserConversationEntity>;

  constructor(data_source: DataSource) {
    this._conversation_repo = data_source.getRepository(ConversationEntity);
    this._user_repo = data_source.getRepository(UserEntity);
    this._user_conversation_repo = data_source.getRepository(
      UserConversationEntity,
    );
  }

  async init(request: InitConversationRequest, creator: UserEntity) {
    const members = await this._user_repo.find({
      where: { id: In(request.member_ids) },
    });

    const conversation = this._conversation_repo.create({
      name: request.name,
      type: request.type,
      users_conversations: members.map((member) => {
        return this._user_conversation_repo.create({
          user_id: member.id,
          nickname: member.fullname,
          role: CONVERSATION_ROLE_ENUM.MEMBER,
          created_by: creator.username,
          updated_by: creator.username,
        });
      }),
    });

    conversation.users_conversations.push(
      this._user_conversation_repo.create({
        user_id: creator.id,
        nickname: creator.fullname,
        role: CONVERSATION_ROLE_ENUM.ADMIN,
        created_by: creator.username,
        updated_by: creator.username,
      }),
    );

    return await this._conversation_repo.save(conversation);
  }

  async addMember(id: string, request: AddMemberRequest, creator: UserEntity) {
    const conversation = await this._conversation_repo.findOneOrFail({
      where: { id },
      relations: ['user_conversation'],
    });

    const members = await this._user_repo.find({
      where: { id: In(request.member_ids) },
    });

    const user_conversations: UserConversationEntity[] = [];
    members.forEach((member) => {
      if (
        !conversation.users_conversations.some((pc) => pc.user_id === member.id)
      ) {
        user_conversations.push(
          this._user_conversation_repo.create({
            conversation_id: conversation.id,
            user_id: member.id,
            nickname: member.fullname,
            role: CONVERSATION_ROLE_ENUM.MEMBER,
            created_by: creator.username,
            updated_by: creator.username,
          }),
        );
      }
    });

    return await this._user_conversation_repo.save(user_conversations);
  }
}
