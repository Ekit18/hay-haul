import React from 'react';
import { AppRoute } from './lib/constants/routes';
import { AuctionDetailsPage } from './pages/AuctionDetailsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { MainPage as BusinessmanMainPage } from './pages/businessman-pages/MainPage';
import { Warehouses } from './pages/businessman-pages/Warehouses';
import { AllAuction } from './pages/farmer-pages/Auctions';
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
    Component: Warehouses
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
