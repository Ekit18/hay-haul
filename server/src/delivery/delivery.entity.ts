import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { DriverDetails } from 'src/driver-details/driver-details.entity';
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
  AtFarmerFacility = 'AT_FARMER_FACILITY',
  Loading = 'LOADING',
  OnTheWay = 'ON_THE_WAY',
  Unloading = 'UNLOADING',
  AtBusinessFacility = 'AT_BUSINESS_FACILITY',
}

@Entity()
export class Delivery {
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

  @Column({ enum: DeliveryStatus, default: DeliveryStatus.AtBusinessFacility })
  status: DeliveryStatus;
}
