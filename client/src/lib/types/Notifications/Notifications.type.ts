import { NotificationMessage } from '@/lib/enums/notification-message.enum';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { User } from '../User/User.type';

export type Notification = {
  id: string;
  message: NotificationMessage;
  createdAt: Date;
  isRead: boolean;
  productAuctionId: string;
  productAuction: ProductAuction;
  receiverId: string;
  receiver: User;
};
