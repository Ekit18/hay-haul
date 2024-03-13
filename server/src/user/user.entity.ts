import { Otp } from 'src/auth/otp.entity';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductAuctionBid } from 'src/product-auction-bid/product-auction-bid.entity';
import { Token } from 'src/token/token.entity';
import {
  Check,
  Column,
  Entity,
  OneToMany,
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
export class User extends Timestamps {
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

  @Column()
  isVerified: boolean;

  @OneToMany(() => FacilityDetails, (facilityDetail) => facilityDetail.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  facilityDetails: FacilityDetails;

  @OneToOne(() => Token, (token) => token.user)
  token: Token;

  @OneToMany(
    () => ProductAuctionBid,
    (productAuctionBid) => productAuctionBid.user,
  )
  productAuctionBids: ProductAuctionBid[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otp: Otp;
}
