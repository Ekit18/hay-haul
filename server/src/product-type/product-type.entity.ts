import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Products } from 'src/products/products.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Products, (products) => products.productType)
  product: Products;

  @ManyToOne(
    () => FacilityDetails,
    (facilityDetails) => facilityDetails.productTypes,
  )
  @JoinColumn()
  facilityDetails: FacilityDetails;

  @Column()
  name: string;
}
