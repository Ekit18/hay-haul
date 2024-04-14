import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { User } from 'src/user/user.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentTargetType } from '../enums/enums';

export abstract class Payment {
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

  target: ProductAuction | DeliveryOrder;
}
