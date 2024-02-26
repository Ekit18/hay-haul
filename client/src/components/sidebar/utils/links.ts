import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { BadgeDollarSign, Home, LucideIcon, PackageSearch, SendToBack, Tractor } from 'lucide-react';

type Link = {
  title: string;
  url: string;
  icon: LucideIcon;
};

type Links = {
  [key in UserRole]: Link[];
};

export const links: Links = {
  [UserRole.Farmer]: [
    {
      title: 'Home',
      url: AppRoute.General.Main,
      icon: Home
    },
    {
      title: 'Farms',
      url: AppRoute.Farmer.Farms,
      icon: Tractor
    },
    {
      title: 'Products',
      url: AppRoute.Farmer.Products,
      icon: PackageSearch
    },
    {
      title: 'Auction',
      url: AppRoute.General.Auction,
      icon: BadgeDollarSign
    },
    {
      title: 'Orders',
      url: AppRoute.Farmer.Orders,
      icon: SendToBack
    }
  ],
  [UserRole.Businessman]: [],
  [UserRole.Carrier]: [],
  [UserRole.Driver]: []
};
