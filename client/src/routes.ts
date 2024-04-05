import React from 'react';
import { AppRoute } from './lib/constants/routes';
import { AllAuction } from './pages/AllAuctions';
import { AuctionDetailsPage } from './pages/AuctionDetailsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { Depots } from './pages/businessman-pages/Depots';
import { MainPage as BusinessmanMainPage } from './pages/businessman-pages/MainPage';
import { MyBids } from './pages/businessman-pages/MyBids';
import { CreateAuction } from './pages/farmer-pages/CreateAuction';
import { Farms } from './pages/farmer-pages/Farms';
import { MainPage as FarmerMainPage } from './pages/farmer-pages/MainPage';
import { MyAuctions } from './pages/farmer-pages/MyAuctions';
import { ProductsPage } from './pages/farmer-pages/ProductsPage';
import { UpdateAuction } from './pages/farmer-pages/UpdateAuction';

type Route = {
  path: string;
  Component: () => React.ReactNode;
};

export const generalRoutes: Route[] = [
  {
    path: AppRoute.General.Auctions,
    Component: AllAuction
  },
  {
    path: AppRoute.General.AuctionDetails,
    Component: AuctionDetailsPage
  }
];

export const businessRoutes: Route[] = [
  {
    path: AppRoute.General.Main,
    Component: BusinessmanMainPage
  },
  {
    path: AppRoute.Businessman.Depots,
    Component: Depots
  },
  {
    path: AppRoute.Businessman.Bids,
    Component: MyBids
  }
];

export const farmerRoutes: Route[] = [
  {
    path: AppRoute.General.Main,
    Component: FarmerMainPage
  },
  {
    path: AppRoute.Farmer.Products,
    Component: ProductsPage
  },
  {
    path: AppRoute.Farmer.Farms,
    Component: Farms
  },
  {
    path: AppRoute.General.MyAuctions,
    Component: MyAuctions
  },
  {
    path: AppRoute.Farmer.CreateAuction,
    Component: CreateAuction
  },
  {
    path: AppRoute.Farmer.UpdateAuction,
    Component: UpdateAuction
  }
  // {
  //   path: AppRoute.Farmer.Farms,
  //   Component: Farms
  // }
];

export const authRoutes: Route[] = [
  {
    path: AppRoute.General.ResetPassword,
    Component: ResetPasswordPage
  },
  {
    path: AppRoute.General.SignIn,
    Component: SignInPage
  },
  {
    path: AppRoute.General.SignUp,
    Component: SignUpPage
  }
];
