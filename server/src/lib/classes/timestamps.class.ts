import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class Timestamps {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
