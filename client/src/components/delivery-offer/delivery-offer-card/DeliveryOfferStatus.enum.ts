import { DeliveryOfferStatus } from '@/lib/types/DeliveryOffer/DeliveryOffer.type';

export type DeliveryOfferStatusType = {
  [K in keyof typeof DeliveryOfferStatus]: string;
};

export const deliveryOfferStatus: DeliveryOfferStatusType = {
  [DeliveryOfferStatus.Pending]: 'bg-gray-200',
  [DeliveryOfferStatus.Rejected]: 'bg-red-500 text-white',
  [DeliveryOfferStatus.Accepted]: 'bg-green-700 text-white'
};
