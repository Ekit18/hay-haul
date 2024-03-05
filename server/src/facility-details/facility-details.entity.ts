import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductType } from 'src/product-type/product-type.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class FacilityDetails extends Timestamps {
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
    { cascade: true, onDelete: 'CASCADE' },
  )
  productTypes: ProductType[];

  @OneToMany(() => Product, (product) => product.facilityDetails, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  products: Product[];
}
