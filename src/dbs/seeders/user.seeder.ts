import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

import { ROLE_TYPE_ENUM } from '@/constants';
import { _hash } from '@/modules/auth/utils';

import { UserEntity } from '../entities';

export default class UserSeeder implements Seeder {
  public async run(data_source: DataSource): Promise<void> {
    const user_repository = data_source.getRepository(UserEntity);

    const fullname = 'Administator';
    const email = 'admin@personal.com';

    const user = user_repository.create({
      username: 'admin',
      email,
      fullname,
      password: await _hash('12345'),
      type: ROLE_TYPE_ENUM.ADMIN,
      users_conversations: [],
    });

    await user_repository.save(user);
  }
}
