import { Payment } from 'src/lib/classes/payment.class';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class ProductAuctionPayment extends Payment {
  @Column()
  auctionId: string;

  @OneToOne(() => ProductAuction, (auction) => auction.payment)
  @JoinColumn({ name: 'auctionId' })
  auction: ProductAuction;
}
