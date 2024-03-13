import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['auctionId', 'userId', 'price'])
export class ProductAuctionBid {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  auctionId: string;

  @ManyToOne(() => ProductAuction, (productAuction) => productAuction.bids)
  @JoinColumn({ name: 'auctionId' })
  productAuction: ProductAuction;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.productAuctionBids)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  price: number;
}
