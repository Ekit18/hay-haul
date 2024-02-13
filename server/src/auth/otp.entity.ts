import { ValueOf } from 'src/lib/types/types';
import { User } from 'src/user/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
export enum OtpType {
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

const types = Object.values(OtpType)
  .map((role) => `'${role}'`)
  .join(', ');

@Entity()
@Unique(['userId', 'type'])
@Check(`"type" IN (${types})`)
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  otp: string;

  @Column({
    type: 'nvarchar',
  })
  type: ValueOf<OtpType>;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.otp)
  @JoinColumn({ name: 'userId' })
  user: User;
}
