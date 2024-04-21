import { NotificationMessage } from '@/lib/enums/notification-message.enum';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { User } from '../User/User.type';

export enum Notifiable {
  ProductAuction = 'ProductAuction',
  DeliveryOrder = 'DeliveryOrder',
}

export type Notification = {
  id: string;
  message: NotificationMessage;
  createdAt: Date;
  isRead: boolean;
  notifiableId: string;
  notifiableType: Notifiable
  receiverId: string;
  receiver: User;
};
