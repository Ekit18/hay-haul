import { DeliveryOffer } from 'src/delivery-offer/delivery-offer.entity';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { User } from 'src/user/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DeliveryOrderStatus {
  Inactive = 'Inactive',
  Active = 'Active',
  WaitingPayment = 'WaitingPayment',
  Paid = 'Paid',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
}

const statuses = Object.values(DeliveryOrderStatus)
  .map((status) => `'${status}'`)
  .join(', ');

@Check(`"deliveryOrderStatus" IN (${statuses})`)
@Entity()
export class DeliveryOrder extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  desiredPrice: number;

  @Column()
  desiredDate: Date;

  @Column({ default: DeliveryOrderStatus.Inactive })
  deliveryOrderStatus: DeliveryOrderStatus;

  @Column()
  productAuctionId: string;

  @OneToOne(() => ProductAuction)
  @JoinColumn({ name: 'productAuctionId' })
  productAuction: ProductAuction;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.deliveryOrders)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(
    () => DeliveryOffer,
    (deliveryOffer) => deliveryOffer.deliveryOrder,
  )
  deliveryOffers: DeliveryOffer[];

  @Column()
  depotId: string;

  @ManyToOne(
    () => FacilityDetails,
    (facilityDetails) => facilityDetails.deliveryOrders,
  )
  @JoinColumn({ name: 'depotId' })
  facilityDetails: FacilityDetails;
}
