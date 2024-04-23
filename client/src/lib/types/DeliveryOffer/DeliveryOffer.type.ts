import { ValueOf } from '../types';

export const DeliveryOfferStatus = {
  Pending: 'Pending',
  Rejected: 'Rejected',
  Accepted: 'Accepted',
} as const;

export type DeliveryOfferStatusValues = ValueOf<typeof DeliveryOfferStatus>;

export type DeliveryOffer = {
  id: string;
  deliveryOrderId: string;
  userId: string;
  price: number;
  offerStatus: DeliveryOfferStatusValues;
  user: {
    id: string;
    facilityDetails: {
      name: string;
      address: string;
    }[];
  };
};

export const deliveryOfferStatusText = {
  [DeliveryOfferStatus.Pending]: 'Pending',
  [DeliveryOfferStatus.Rejected]: 'Rejected',
  [DeliveryOfferStatus.Accepted]: 'Accepted',
};
