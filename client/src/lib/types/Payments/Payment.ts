import { PaymentStatus } from '@/lib/enums/payment-status.enum';
import { PaymentTargetType } from '@/lib/enums/payment-target-type.enum';
import { DeliveryOrder } from '../DeliveryOrder/DeliveryOrder.type';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { Timestamps } from '../Timestamps/Timestamps';
import { User } from '../User/User.type';

export type Payment = Timestamps & {
  id: string;

  buyerId: string;

  buyer: User;

  sellerId: string;

  seller: User;

  amount: number;

  status: PaymentStatus;
} & (
    | {
        targetType: PaymentTargetType.DeliveryOrder;

        target: DeliveryOrder;
      }
    | {
        targetType: PaymentTargetType.ProductAuction;

        target: ProductAuction;
      }
  );
