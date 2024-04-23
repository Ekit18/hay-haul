import { DeliveryOrderStatus } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';

export type DeliveryOrderStatusType = {
  [K in keyof typeof DeliveryOrderStatus]: string;
};

export const deliveryOrderStatus: DeliveryOrderStatusType = {
  [DeliveryOrderStatus.Inactive]: 'bg-gray-400 text-white',
  [DeliveryOrderStatus.Active]: 'bg-green-500 text-white',
  [DeliveryOrderStatus.WaitingPayment]: 'bg-yellow-400 text-black',
  [DeliveryOrderStatus.Paid]: 'bg-green-700 text-white',
  [DeliveryOrderStatus.Delivering]: 'bg-purple-600 text-white',
  [DeliveryOrderStatus.Delivered]: 'bg-blue-500 text-white'
};
