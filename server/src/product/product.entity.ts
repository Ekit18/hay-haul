import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductType } from 'src/product-type/product-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => ProductType, (productType) => productType.product)
  @JoinColumn()
  productType: ProductType;
}
