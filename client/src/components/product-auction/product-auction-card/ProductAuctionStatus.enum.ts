import { ProductAuctionStatus } from '@/lib/types/ProductAuction/ProductAuction.type';

export type ProductAuctionStatusType = {
  [key in ProductAuctionStatus]: string;
};

export const productAuctionStatus: ProductAuctionStatusType = {
  [ProductAuctionStatus.Active]: 'bg-green-500  text-white',
  [ProductAuctionStatus.StartSoon]: 'bg-blue-500 text-white',
  [ProductAuctionStatus.Inactive]: 'bg-gray-400 text-white',
  [ProductAuctionStatus.Closed]: 'bg-white border border-black',
  [ProductAuctionStatus.EndSoon]: 'bg-orange-600 text-white ',
  [ProductAuctionStatus.Ended]: 'bg-red-500 text-white',
  [ProductAuctionStatus.Unpaid]: 'bg-purple-600 text-white',
  [ProductAuctionStatus.WaitingPayment]: 'bg-yellow-400'
};
