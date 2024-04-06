import { Timestamps } from 'src/lib/classes/timestamps.class';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StripeEntry extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountId: string;

  @Column()
  linkUrl: string;

  @Column()
  linkExpiresAt: Date;

  @Column({ default: false })
  payoutsEnabled: boolean;

  @Column({ unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.stripeEntry)
  @JoinColumn({ name: 'userId' })
  user: User;
}
