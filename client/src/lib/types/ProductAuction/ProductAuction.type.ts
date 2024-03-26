import { AuctionPhotoType } from '../AuctionPhoto/AuctionPhoto.type';
import { Product } from '../Product/Product.type';
import { ProductAuctionBid } from '../ProductAuctionBid/ProductAuctionBid.type';
import { ValueOf } from '../types';

export enum ProductAuctionStatus {
  Inactive = 'Inactive',
  StartSoon = 'Start soon',
  Active = 'Active',
  EndSoon = 'End soon',
  Ended = 'Ended',
  WaitingPayment = 'Waiting payment',
  Closed = 'Closed',
  Unpaid = 'Unpaid'
}

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
  auctionStatus: ProductAuctionStatus;
  photos: AuctionPhotoType[];
};
