import { MAIN_ROUTE, SIGN_IN, SIGN_UP } from './lib/constants/routes';
import { MainPage } from './pages/MainPage';
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
