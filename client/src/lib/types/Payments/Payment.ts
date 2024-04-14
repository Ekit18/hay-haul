import { PaymentTargetType } from '@/lib/enums/payment-target-type.enum';
import { DeliveryOrder } from '../DeliveryOrder/DeliveryOrder.type';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { User } from '../User/User.type';

export type Payment = {
  id: string;

  buyerId: string;

  buyer: User;

  sellerId: string;

  seller: User;

  amount: number;

  targetType: PaymentTargetType;

  target: ProductAuction | DeliveryOrder;
};
