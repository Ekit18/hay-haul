import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class S3File extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  name: string;

  @Column()
  contentType: string;

  signedUrl?: string;

  @ManyToOne(() => ProductAuction, (auction) => auction.photos)
  productAuction: ProductAuction;
}
