import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
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

export enum DeliveryOfferStatus {
  Pending = 'pending',
}

const statuses = Object.values(DeliveryOfferStatus)
  .map((status) => `'${status}'`)
  .join(', ');

@Check(`"offerStatus" IN (${statuses})`)
@Entity()
@Unique('uniq_delivery_order_user', ['deliveryOrderId', 'userId', 'price'])
export class DeliveryOffer extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deliveryOrderId: string;

  @ManyToOne(
    () => DeliveryOrder,
    (deliveryOrder) => deliveryOrder.deliveryOffers,
  )
  @JoinColumn({ name: 'deliveryOrderId' })
  deliveryOrder: DeliveryOrder;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.deliveryOffers)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  price: number;

  @Column({
    default: DeliveryOfferStatus.Pending,
  })
  offerStatus: DeliveryOfferStatus;
}
