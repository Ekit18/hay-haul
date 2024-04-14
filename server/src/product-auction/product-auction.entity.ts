import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { Notification } from 'src/notification/notification.entity';
import { ProductAuctionBid } from 'src/product-auction-bid/product-auction-bid.entity';
import { ProductAuctionPayment } from 'src/product-auction-payment/product-auction-payment.entity';
import { Product } from 'src/product/product.entity';
import { S3File } from 'src/s3-file/s3-file.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProductAuctionStatus {
  Inactive = 'Inactive',
  StartSoon = 'StartSoon',
  Active = 'Active',
  EndSoon = 'EndSoon',
  Ended = 'Ended',
  WaitingPayment = 'WaitingPayment',
  Closed = 'Closed',
  Unpaid = 'Unpaid',
  Paid = 'Paid',
}

const statuses = Object.values(ProductAuctionStatus)
  .map((status) => `'${status}'`)
  .join(', ');

@Check(`"auctionStatus" IN (${statuses})`)
@Entity()
export class ProductAuction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @OneToOne(() => Product, (products) => products.productAuction)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  startPrice: number;

  @Column()
  buyoutPrice: number;

  @Column()
  bidStep: number;

  @Column()
  startDate: Date;

  @Column()
  paymentPeriod: Date;

  @Column()
  description: string;

  @Column()
  endDate: Date;

  @OneToOne(() => ProductAuctionBid, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'currentMaxBidId' })
  currentMaxBid: ProductAuctionBid;

  @OneToOne(
    () => DeliveryOrder,
    (deliveryOrder) => deliveryOrder.productAuction,
  )
  deliveryOrder: DeliveryOrder;

  @Column({ nullable: true })
  currentMaxBidId: string;

  @OneToMany(
    () => ProductAuctionBid,
    (productAuctionBid) => productAuctionBid.productAuction,
    { cascade: true, onDelete: 'CASCADE' },
  )
  bids: ProductAuctionBid[];

  @Column({ default: ProductAuctionStatus.Inactive })
  auctionStatus: ProductAuctionStatus;

  @OneToMany(() => Notification, (notification) => notification.productAuction)
  notifications: Notification;

  @OneToMany(() => S3File, (file) => file.productAuction)
  photos: S3File[];

  @OneToOne(() => ProductAuctionPayment, (payment) => payment.auction)
  payment: ProductAuctionPayment;
}
