import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { DriverDetails } from 'src/driver-details/driver-details.entity';
import { Timestamps } from 'src/lib/classes/timestamps.class';
import { Transport } from 'src/transport/transport.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DeliveryStatus {
  AwaitingDriver = 'AWAITING_DRIVER',
  AtFarmerFacility = 'AT_FARMER_FACILITY',
  Loading = 'LOADING',
  OnTheWay = 'ON_THE_WAY',
  Unloading = 'UNLOADING',
  AtBusinessFacility = 'AT_BUSINESS_FACILITY',
  Finished = 'Finished'
}

@Entity()
export class Delivery extends Timestamps {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  driverId: string;

  @Column()
  transportId: string;

  @Column()
  deliveryOrderId: string;

  @Column()
  carrierId: string;

  @ManyToOne(() => DriverDetails, (driver) => driver.deliveries)
  @JoinColumn({ name: 'driverId' })
  driver: DriverDetails;

  @ManyToOne(() => Transport, (transport) => transport.deliveries)
  @JoinColumn({ name: 'transportId' })
  transport: Transport;

  @ManyToOne(() => User, (user) => user.deliveries)
  @JoinColumn({ name: 'carrierId' })
  carrier: User;

  @OneToOne(() => DeliveryOrder, (deliveryOrder) => deliveryOrder.delivery)
  @JoinColumn({ name: 'deliveryOrderId' })
  deliveryOrder: DeliveryOrder;

  @Column({ nullable: true, enum: DeliveryStatus, default: null })
  status: DeliveryStatus;
}
