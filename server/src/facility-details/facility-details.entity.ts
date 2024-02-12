import { ProductType } from 'src/product-type/product-type.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FacilityDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  code: string;

  @OneToMany(() => ProductType, (productTypes) => productTypes.facilityDetails)
  productTypes: ProductType[];
}
