import { DeliveryOrderStatus } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';

export type DeliveryOrderStatusType = {
  [K in keyof typeof DeliveryOrderStatus]: string;
};

export const deliveryOrderStatus: DeliveryOrderStatusType = {
  [DeliveryOrderStatus.Inactive]: 'bg-gray-400 text-white'
};
