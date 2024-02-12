import { Businessman } from 'src/businessman/businessman.entity';
import { Carrier } from 'src/carrier/carrier.entity';
import { Farmer } from 'src/farmer/farmer.entity';
import { Token } from 'src/token/token.entity';
import {
  Check,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  Businessman = 'Businessman',
  Carrier = 'Carrier',
  Driver = 'Driver',
  Farmer = 'Farmer',
}

const roles = Object.values(UserRole)
  .map((role) => `'${role}'`)
  .join(', ');

@Entity()
@Check(`"role" IN (${roles})`)
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  fullName: string;

  @Column({
    type: 'nvarchar',
  })
  role: UserRole;

  @OneToOne(() => Farmer, (farmer) => farmer.user)
  farmer: Farmer;

  @OneToOne(() => Businessman, (businessman) => businessman.user)
  businessman: Businessman;

  @OneToOne(() => Carrier, (carrier) => carrier.user)
  carrier: Carrier;

  @OneToOne(() => Token, (token) => token.user)
  token: Token;
}
