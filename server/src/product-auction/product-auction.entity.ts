import { Notification } from 'src/notification/notification.entity';
import { ProductAuctionBid } from 'src/product-auction-bid/product-auction-bid.entity';
import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProductAuctionStatus {
  Inactive = 'Inactive',
  Active = 'Active',
  EndSoon = 'End soon',
  Ended = 'Ended',
  WaitingPayment = 'Waiting payment',
  Closed = 'Closed',
  Unpaid = 'Unpaid',
}

const statuses = Object.values(ProductAuctionStatus)
  .map((role) => `'${role}'`)
  .join(', ');

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
}
