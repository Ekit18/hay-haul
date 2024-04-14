import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import {
  ArrowRightLeft,
  BadgeDollarSign,
  HandCoins,
  Home,
  LucideIcon,
  PackageSearch,
  Tractor,
  Truck,
  WalletCards,
  Warehouse
} from 'lucide-react';

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
      title: 'Auctions',
      url: AppRoute.General.Auctions,
      icon: BadgeDollarSign
    },
    {
      title: 'My auctions',
      url: AppRoute.General.MyAuctions,
      icon: ArrowRightLeft
    },
    {
      title: 'Payments',
      url: AppRoute.General.Payments,
      icon: WalletCards
    }
  ],
  [UserRole.Businessman]: [
    {
      title: 'Home',
      url: AppRoute.General.Main,
      icon: Home
    },
    {
      title: 'Depots',
      url: AppRoute.Businessman.Depots,
      icon: Warehouse
    },
    {
      title: 'Products',
      url: AppRoute.Businessman.Products,
      icon: PackageSearch
    },
    {
      title: 'Bids',
      url: AppRoute.Businessman.Bids,
      icon: HandCoins
    },
    {
      title: 'Delivery',
      url: AppRoute.Businessman.Delivery,
      icon: Truck
    },
    {
      title: 'Auctions',
      url: AppRoute.General.Auctions,
      icon: BadgeDollarSign
    },
    {
      title: 'Payments',
      url: AppRoute.General.Payments,
      icon: WalletCards
    }
  ],
  [UserRole.Carrier]: [
    {
      title: 'Home',
      url: AppRoute.General.Main,
      icon: Home
    },
    {
      title: 'Delivery',
      url: AppRoute.Businessman.Delivery,
      icon: Truck
    },
    {
      title: 'Payments',
      url: AppRoute.General.Payments,
      icon: WalletCards
    }
  ],
  [UserRole.Driver]: [
    {
      title: 'Home',
      url: AppRoute.General.Main,
      icon: Home
    }
  ]
};
