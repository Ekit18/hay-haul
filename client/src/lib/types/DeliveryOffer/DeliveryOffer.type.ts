import { ValueOf } from '../types';

export const DeliveryOfferStatus = {
  Pending: 'pending'
} as const;

export type DeliveryOfferStatusValues = ValueOf<typeof DeliveryOfferStatus>;

export type DeliveryOffer = {
  id: string;
  deliveryOrderId: string;
  userId: string;
  price: number;
  offerStatus: DeliveryOfferStatusValues;
};
