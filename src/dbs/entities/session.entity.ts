import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity('sessions')
export class SessionEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('uuid', { name: 'user_id', nullable: false })
  user_id!: string;

  @Column('varchar', { name: 'access_token', nullable: false })
  access_token!: string;

  @Column('varchar', { name: 'refresh_token', nullable: false })
  refresh_token!: string;

  @CreateDateColumn({ name: 'login_at', type: 'timestamp' })
  login_at!: Date;

  @Column('timestamp', { name: 'logout_at', nullable: true })
  logout_at: Date | null;
  //#endregion

  //#region RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.id, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: Relation<UserEntity>;
  //#endregion
}
