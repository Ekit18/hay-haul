import { DeliveryOffer } from '../DeliveryOffer/DeliveryOffer.type';
import { FacilityDetails } from '../FacilityDetails/FacilityDetails.type';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { ValueOf } from '../types';

export const DeliveryOrderStatus = {
  Inactive: 'Inactive',
  Active: 'Active',
  WaitingPayment: 'WaitingPayment',
  Paid: 'Paid',
  Delivering: 'Delivering',
  Delivered: 'Delivered'
} as const;

export type DeliveryOrderStatusValues = ValueOf<typeof DeliveryOrderStatus>;

export type DeliveryOrder = {
  id: string;
  desiredPrice: number;
  desiredDate: Date;
  deliveryOrderStatus: DeliveryOrderStatusValues;
  productAuctionId: string;
  userId: string;
  depotId: string;
  facilityDetails: FacilityDetails;
  productAuction: ProductAuction;
  deliveryOffers: DeliveryOffer[];
};

export const DeliveryOrderStatusText = {
  [DeliveryOrderStatus.Inactive]: 'Inactive',
  [DeliveryOrderStatus.Active]: 'Active',
  [DeliveryOrderStatus.WaitingPayment]: 'Waiting payment',
  [DeliveryOrderStatus.Paid]: 'Paid',
  [DeliveryOrderStatus.Delivering]: 'Delivering',
  [DeliveryOrderStatus.Delivered]: 'Delivered'
};
