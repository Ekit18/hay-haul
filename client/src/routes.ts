import { MAIN_ROUTE, OTP_CONFIRM, RESET_PASSWORD, SIGN_IN, SIGN_UP } from './lib/constants/routes';
import { MainPage } from './pages/MainPage';
import { OtpConfirmPage } from './pages/OtpConfirmPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';

export const publicRoutes = [
  {
    path: MAIN_ROUTE,
    Component: MainPage
  },
  {
    path: SIGN_IN,
    Component: SignInPage
  },
  {
    path: SIGN_UP,
    Component: SignUpPage
  },
  {
    path: OTP_CONFIRM,
    Component: OtpConfirmPage
  },
  {
    path: RESET_PASSWORD,
    Component: ResetPasswordPage
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
