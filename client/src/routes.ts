import { AppRoute } from './lib/constants/routes';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { FarmerAuction } from './pages/farmer-pages/Auction';
import { Farms } from './pages/farmer-pages/Farms';
import { MainPage } from './pages/farmer-pages/MainPage';
import { Orders } from './pages/farmer-pages/Orders';
import { ProductsPage } from './pages/farmer-pages/ProductsPage';

// export const businessRoutes = [
//   {
//     path: AppRoute.General.Auction,
//     Component: BusinessAuction
//   }
// ];
export const farmerRoutes = [
  {
    path: AppRoute.General.Main,
    Component: MainPage
  },
  {
    path: AppRoute.General.Auction,
    Component: FarmerAuction
  },
  {
    path: AppRoute.Farmer.Products,
    Component: ProductsPage
  },
  {
    path: AppRoute.Farmer.Orders,
    Component: Orders
  },
  {
    path: AppRoute.Farmer.Farms,
    Component: Farms
  }
];
export const authRoutes = [
  // {
  //   path: AppRoute.General.OtpConfirm,
  //   Component: OtpConfirmPage
  // },
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
