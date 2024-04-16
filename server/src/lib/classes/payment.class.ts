import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { User } from 'src/user/user.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  PaymentDirection,
  PaymentStatus,
  PaymentTargetType,
} from '../enums/enums';
import { Timestamps } from './timestamps.class';

export abstract class Payment extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  buyerId: string;

  @ManyToOne(() => User, (user) => user.productAuctionPaymentsAsBuyer)
  @JoinColumn({ name: 'buyerId' })
  buyer: User;

  @Column()
  sellerId: string;

  @ManyToOne(() => User, (user) => user.productAuctionPaymentsAsSeller)
  @JoinColumn({ name: 'sellerId' })
  seller: User;

  @Column()
  amount: number;

  @Column({ enum: Object.values(PaymentTargetType) })
  targetType: PaymentTargetType;

  @Column({
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.WaitingPayment,
  })
  status: PaymentStatus;

  target: ProductAuction | DeliveryOrder;

  direction: PaymentDirection;
}
