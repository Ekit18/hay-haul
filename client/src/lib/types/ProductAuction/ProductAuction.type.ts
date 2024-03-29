import { AuctionPhotoType } from '../AuctionPhoto/AuctionPhoto.type';
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
  Unpaid: 'Unpaid'
} as const;

export type ProductAuctionStatusDict = {
  [K in string]: string;
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
};
