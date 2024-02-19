import { ProductType } from 'src/product-type/product-type.entity';
import { Products } from 'src/products/products.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToOne(() => User, (user) => user.facilityDetails)
  user: User;

  @OneToMany(
    () => ProductType,
    (productTypes) => productTypes.facilityDetails,
    { cascade: true },
  )
  productTypes: ProductType[];

  @OneToMany(() => Products, (products) => products.facility)
  products: Products[];
}
