import { FacilityDetails } from 'src/company-details/company-details.entity';
import { Products } from 'src/products/products.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
@Entity()
export class ProductType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Products, { onDelete: 'CASCADE' })
  product: Products;

  @ManyToOne(() => FacilityDetails, (facilityDetails) => facilityDetails.)
  facilityDetails: FacilityDetails;

  @Column()
  name: string;
}
