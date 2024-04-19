import { DeliveryOfferStatus } from '@/lib/types/DeliveryOffer/DeliveryOffer.type';

export type DeliveryOfferStatusType = {
  [K in keyof typeof DeliveryOfferStatus]: string;
};

export const deliveryOfferStatus: DeliveryOfferStatusType = {
  [DeliveryOfferStatus.Pending]: 'bg-blue-500 text-white',
  [DeliveryOfferStatus.Rejected]: 'bg-red-500 text-white',
  [DeliveryOfferStatus.WaitingPayment]: 'bg-yellow-400',
  [DeliveryOfferStatus.Paid]: 'bg-green-700 text-white'
};
