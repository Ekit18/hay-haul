import { Timestamps } from 'src/lib/classes/timestamps.class';
import { PaymentTargetType } from 'src/lib/enums/enums';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => User, (user) => user.stripeEntry)
  @JoinColumn({ name: 'userId' })
  user: User;
}

export class PaymentIntentMetadata {
  paymentId: string;
  paymentTargetType: PaymentTargetType;
}
