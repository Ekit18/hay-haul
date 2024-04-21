import { Otp } from 'src/auth/otp.entity';
import { DeliveryOffer } from 'src/delivery-offer/delivery-offer.entity';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { DriverDetails } from 'src/driver-details/driver-details.entity';
import { FacilityDetails } from 'src/facility-details/facility-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { ProductAuctionBid } from 'src/product-auction-bid/product-auction-bid.entity';
import { ProductAuctionPayment } from 'src/product-auction-payment/product-auction-payment.entity';
import { StripeEntry } from 'src/stripe/stripe.entity';
import { Token } from 'src/token/token.entity';
import { Transport } from 'src/transport/transport.entity';
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

  @OneToOne(() => StripeEntry, (entry) => entry.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  stripeEntry?: StripeEntry;

  @OneToMany(
    () => ProductAuctionBid,
    (productAuctionBid) => productAuctionBid.user,
  )
  productAuctionBids: ProductAuctionBid[];

  @OneToMany(
    () => ProductAuctionPayment,
    (productAuctionPayment) => productAuctionPayment.buyer,
  )
  productAuctionPaymentsAsBuyer: ProductAuctionPayment[];

  @OneToMany(
    () => ProductAuctionPayment,
    (productAuctionPayment) => productAuctionPayment.seller,
  )
  productAuctionPaymentsAsSeller: ProductAuctionPayment[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otp: Otp;

  @OneToMany(() => DeliveryOrder, (deliveryOrder) => deliveryOrder.user)
  deliveryOrders: DeliveryOrder[];

  @OneToMany(() => DeliveryOffer, (deliveryOffer) => deliveryOffer.user)
  deliveryOffers: DeliveryOffer[];

  @OneToOne(() => DriverDetails, driverDetails => driverDetails.user, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: true,
  })
  driverDetails: DriverDetails | null;

  @OneToMany(() => DriverDetails, driverDetails => driverDetails.carrier)
  drivers: DriverDetails[];

  @OneToMany(() => Transport, transport => transport.carrier)
  transports: Transport[];
}
