import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { ProductType } from 'src/product-type/product-type.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  facilityDetailsId: string;

  @ManyToOne(
    () => FacilityDetails,
    (facilityDetails) => facilityDetails.products,
  )
  @JoinColumn({ name: 'facilityDetailsId' })
  facilityDetails: FacilityDetails;

  @ManyToOne(() => ProductType, (productType) => productType.product, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  productType: ProductType;

  @OneToOne(() => ProductAuction, (auction) => auction.product)
  productAuction: ProductAuction;


  @Column({ nullable: true, default: null })
  deletedAt: Date | null;
}
