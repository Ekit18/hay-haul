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

export enum AuctionStatus {
  Inactive = 'Inactive',
  Active = 'Active',
  WaitingPayment = 'Waiting payment',
  Closed = 'Closed',
  Ended = 'Ended',
  Unpaid = 'Unpaid',
}

const statuses = Object.values(AuctionStatus)
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
  endDate: Date;

  //todo: cascade delete
  @OneToOne(() => ProductAuctionBid)
  @JoinColumn()
  currentMaxBid: ProductAuctionBid;

  //todo: cascade delete
  @OneToMany(
    () => ProductAuctionBid,
    (productAuctionBid) => productAuctionBid.productAuction,
  )
  bids: ProductAuctionBid[];

  @Column({ default: AuctionStatus.Inactive })
  auctionStatus: AuctionStatus;
}
