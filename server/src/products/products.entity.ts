import { Farm } from 'src/farm/farm.entity';
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

  @ManyToOne(() => Farm, (farm) => farm.products)
  farm: Farm;

  @OneToOne(() => ProductType, (productType) => productType.product)
  @JoinColumn()
  productType: ProductType;
}
