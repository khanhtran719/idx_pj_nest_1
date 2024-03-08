import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  // #region COLUMNS
  @Column('boolean', { name: 'is_active', default: true })
  is_active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @Column('varchar', { name: 'created_by', nullable: false, default: 'system' })
  created_by: string;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at: Date | null;

  @Column('varchar', { name: 'updated_by', nullable: true })
  updated_by: string | null;
  // #endregion

  // #region RELATIONS
  // #endregion

  // #region OTHERS
  // #endregion
}
