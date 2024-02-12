import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { ProductType } from 'src/product-type/product-type.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  quantity: number;

  @ManyToOne(() => FacilityDetails, (facility) => facility.products)
  facility: FacilityDetails;

  @OneToOne(() => ProductType, (productType) => productType.product)
  @JoinColumn()
  productType: ProductType;
}
