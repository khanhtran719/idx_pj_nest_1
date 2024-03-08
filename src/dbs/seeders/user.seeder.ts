import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ROLE_TYPE_ENUM } from '@/constants';
import { _hash } from '@/utils';

import { ParticipantEntity, UserEntity } from '../entities';

export default class UserSeeder implements Seeder {
  public async run(data_source: DataSource): Promise<void> {
    const user_repository = data_source.getRepository(UserEntity);
    const participant_repository = data_source.getRepository(ParticipantEntity);

    const fullname = 'Administator';
    const email = 'admin@personal.com';

    const user = user_repository.create({
      username: 'admin',
      email,
      fullname,
      password: _hash('12345'),
      type: ROLE_TYPE_ENUM.ADMIN,
      participant: participant_repository.create({
        name: fullname,
        email,
      }),
    });

    await user_repository.save(user);
  }
}
