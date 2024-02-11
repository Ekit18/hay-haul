import { MAIN_ROUTE } from './lib/constants/routes';
import { MainPage } from './pages/MainPage';

export const publicRoutes = [
  {
    path: MAIN_ROUTE,
    Component: MainPage
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
