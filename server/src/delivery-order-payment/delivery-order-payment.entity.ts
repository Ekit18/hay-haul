import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { Payment } from 'src/lib/classes/payment.class';
import { ProductAuction } from 'src/product-auction/product-auction.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class DeliveryOrderPayment extends Payment {
  @Column()
  orderId: string;

  @OneToOne(() => DeliveryOrder, (order) => order.payment)
  @JoinColumn({ name: 'orderId' })
  order: DeliveryOrder;
}
