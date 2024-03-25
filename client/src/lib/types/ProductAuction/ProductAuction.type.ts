import { AuctionPhotoType } from '../AuctionPhoto/AuctionPhoto.type';
import { Product } from '../Product/Product.type';
import { ProductAuctionBid } from '../ProductAuctionBid/ProductAuctionBid.type';

export enum ProductAuctionStatus {
  Inactive = 'Inactive',
  Active = 'Active',
  EndSoon = 'End soon',
  Ended = 'Ended',
  WaitingPayment = 'Waiting payment',
  Closed = 'Closed',
  Unpaid = 'Unpaid'
}

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
