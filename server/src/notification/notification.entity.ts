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

const notificationMessages = Object.values(NotificationMessage)
  .map((notificationMessage) => `'${notificationMessage}'`)
  .join(', ');

@Entity()
@Check(`"message" IN (${notificationMessages})`)
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

  @Column()
  productAuctionId: string;

  @ManyToOne(
    () => ProductAuction,
    (productAuction) => productAuction.notifications,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'productAuctionId' })
  productAuction: ProductAuction;

  @Column()
  receiverId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  // @ManyToOne(() => User)
  // @JoinColumn({ name: 'senderId' })
  // sender: User;
}
