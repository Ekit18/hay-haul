import { DeliveryOrderStatus, DeliveryOrderStatusValues } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';

export const deliveryOrderStatusToReadableMap: Record<DeliveryOrderStatusValues, string> = {
    [DeliveryOrderStatus.Active]: 'Active',
    [DeliveryOrderStatus.Delivered]: 'Delivered',
    [DeliveryOrderStatus.Delivering]: 'Delivering',
    [DeliveryOrderStatus.Inactive]: 'Inactive',
    [DeliveryOrderStatus.Paid]: 'Paid',
    [DeliveryOrderStatus.WaitingPayment]: 'Waiting Payment',
} as const