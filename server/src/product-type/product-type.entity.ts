import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductType extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Product, (products) => products.productType, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  facilityDetailsId: string;

  @ManyToOne(
    () => FacilityDetails,

    (facilityDetails) => facilityDetails.productTypes,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'facilityDetailsId' })
  facilityDetails: FacilityDetails;

  @Column()
  name: string;
}
