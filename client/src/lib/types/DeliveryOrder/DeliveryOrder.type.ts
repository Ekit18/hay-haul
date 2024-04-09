import { FacilityDetails } from '../FacilityDetails/FacilityDetails.type';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { ValueOf } from '../types';

export const DeliveryOrderStatus = {
  Inactive: 'Inactive',
  Active: 'Active',
  WaitingPayment: 'WaitingPayment'
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
  facilityDetails?: FacilityDetails;
  productAuction?: ProductAuction;
};

export const DeliveryOrderStatusText = {
  [DeliveryOrderStatus.Inactive]: 'Inactive'
};
