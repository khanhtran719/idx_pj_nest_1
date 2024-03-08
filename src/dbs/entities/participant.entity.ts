import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('participants')
export class ParticipantEntity {
  // #region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('uuid', { name: 'user_id', nullable: true })
  user_id: string | null;

  @Column('varchar', { name: 'name', nullable: false })
  name!: string;

  @Column('varchar', { name: 'email', nullable: false, unique: true })
  email!: string;

  @Column('varchar', { name: 'phone', nullable: true })
  phone: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;
  // #endregion

  // #region RELATIONS
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Relation<UserEntity> | null;
  // #endregion

  //#region OTHERS
  //#endregion
}
