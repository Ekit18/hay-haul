import { AppRoute } from './lib/constants/routes';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { MainPage as BusinessmanMainPage } from './pages/businessman-pages/MainPage';
import { Warehouses } from './pages/businessman-pages/Warehouses';
import { FarmerAuction } from './pages/farmer-pages/Auction';
import { Farms } from './pages/farmer-pages/Farms';
import { MainPage } from './pages/farmer-pages/MainPage';
import { ProductsPage } from './pages/farmer-pages/ProductsPage';

export const businessRoutes = [
  {
    path: AppRoute.General.Main,
    Component: BusinessmanMainPage
  },
  {
    path: AppRoute.Businessman.Warehouses,
    Component: Warehouses
  }
];

export const farmerRoutes = [
  {
    path: AppRoute.General.Main,
    Component: MainPage
  },
  {
    path: AppRoute.General.Auctions,
    Component: FarmerAuction
  },
  {
    path: AppRoute.Farmer.Products,
    Component: ProductsPage
  },
  {
    path: AppRoute.Farmer.Farms,
    Component: Farms
  }
  // {
  //   path: AppRoute.Farmer.Farms,
  //   Component: Farms
  // }
];

export const authRoutes = [
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
