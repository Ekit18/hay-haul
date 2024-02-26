import { AppRoute } from './lib/constants/routes';
import { OtpConfirmPage } from './pages/OtpConfirmPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { Auction } from './pages/farmer-pages/Auction';
import { Farms } from './pages/farmer-pages/Farms';
import { MainPage } from './pages/farmer-pages/MainPage';
import { Orders } from './pages/farmer-pages/Orders';
import { ProductsPage } from './pages/farmer-pages/ProductsPage';

export const publicRoutes = [
  {
    path: AppRoute.General.Main,
    Component: MainPage
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
  },
  {
    path: AppRoute.General.Auction,
    Component: Auction
  }

  // {
  //   path: SUPPORT_ROUTE,
  //   Component: SupportPage
  // },
  // {
  //   path: SEARCH_ROUTE,
  //   Component: SearchPage
  // },
  // {

  //   path: ORDER_ROUTE,
  //   Component: OrderPage
  // },
  // {
  //   path: ORDERS_ROUTE,
  //   Component: OrdersPage
  // }
];

export const authRoutes = [
  {
    path: AppRoute.General.OtpConfirm,
    Component: OtpConfirmPage
  },
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
