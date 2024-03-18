import { User } from '../User/User.type';

export type ProductAuctionBid = {
  id: string;
  auctionId: string;
  userId: string;
  user: User;
  price: number;
};
