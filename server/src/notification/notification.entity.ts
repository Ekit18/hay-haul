import { User } from 'src/user/user.entity';

import { ProductAuction } from 'src/product-auction/product-auction.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationMessage } from './enums/notification-message.enum';
import { DeliveryOrder } from 'src/delivery-order/delivery-order.entity';
import { DeliveryOffer } from 'src/delivery-offer/delivery-offer.entity';

export type NotifiableTypes = ProductAuction | DeliveryOrder | DeliveryOffer;

export enum Notifiable {
  ProductAuction = 'ProductAuction',
  DeliveryOrder = 'DeliveryOrder'
}

const notificationMessages = Object.values(NotificationMessage)
  .map((notificationMessage) => `'${notificationMessage}'`)
  .join(', ');

const notificationTypes = Object.values(Notifiable)
  .map((type) => `'${type}'`)
  .join(', ');

@Entity()
@Check(`"message" IN (${notificationMessages})`)
@Check(`"notifiableType" IN (${notificationTypes})`)
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'nvarchar',
  })
  message: NotificationMessage;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({
    type: 'nvarchar',
    default: Notifiable.ProductAuction,
  })
  notifiableType: Notifiable;

  @Column()
  notifiableId: string;

  @Column()
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;
}
