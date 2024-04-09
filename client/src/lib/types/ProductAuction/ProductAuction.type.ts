import { AuctionPhotoType } from '../AuctionPhoto/AuctionPhoto.type';
import { DeliveryOrder } from '../DeliveryOrder/DeliveryOrder.type';
import { Product } from '../Product/Product.type';
import { ProductAuctionBid } from '../ProductAuctionBid/ProductAuctionBid.type';
import { ValueOf } from '../types';

export const ProductAuctionStatus = {
  Inactive: 'Inactive',
  StartSoon: 'StartSoon',
  Active: 'Active',
  EndSoon: 'EndSoon',
  Ended: 'Ended',
  WaitingPayment: 'WaitingPayment',
  Closed: 'Closed',
  Unpaid: 'Unpaid',
  Paid: 'Paid'
} as const;

export type ProductAuctionStatusDict = {
  [K in string]: string;
};

export const ProductAuctionStatusText = {
  [ProductAuctionStatus.Active]: 'Active',
  [ProductAuctionStatus.Closed]: 'Closed',
  [ProductAuctionStatus.EndSoon]: 'End soon',
  [ProductAuctionStatus.Ended]: 'Ended',
  [ProductAuctionStatus.Inactive]: 'Inactive',
  [ProductAuctionStatus.StartSoon]: 'Start soon',
  [ProductAuctionStatus.WaitingPayment]: 'Waiting payment',
  [ProductAuctionStatus.Unpaid]: 'Unpaid',
  [ProductAuctionStatus.Paid]: 'Paid'
};

export type ProductAuctionStatusValues = ValueOf<typeof ProductAuctionStatus>;

export type ProductAuction = {
  id: string;
  productId: string;
  product: Product;
  startPrice: number;
  buyoutPrice: number;
  bidStep: number;
  startDate: string;
  paymentPeriod: string;
  description: string;
  endDate: string;
  currentMaxBid: ProductAuctionBid | null;
  currentMaxBidId: string;
  auctionStatus: ProductAuctionStatusValues;
  photos: AuctionPhotoType[];
  deliveryOrder: DeliveryOrder | null;
};
