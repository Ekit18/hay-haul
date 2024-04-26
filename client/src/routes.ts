import React from 'react';
import { AppRoute } from './lib/constants/routes';
import { AllAuction } from './pages/AllAuctions';
import { AuctionDetailsPage } from './pages/AuctionDetailsPage';
import { DeliveryOrderDetails } from './pages/DeliveryOrderDetails';
import { Notifications } from './pages/Notifications';
import { PaymentsPage } from './pages/PaymentsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { StripeRefreshPage } from './pages/StripeRefreshPage';
import { StripeRegisterPage } from './pages/StripeRegisterPage';
import { StripeReturnPage } from './pages/StripeReturnPage';
import { BusinessDeliveryOrderPage } from './pages/businessman-pages/BusinessDeliveryOrder';
import { Depots } from './pages/businessman-pages/Depots';
import { MainPage as BusinessmanMainPage } from './pages/businessman-pages/MainPage';
import { MyBids } from './pages/businessman-pages/MyBids';
import { StripeProductAuctionPaymentPage } from './pages/businessman-pages/ProductAuctionPaymentPage';
import { CarrierDeliveryOrderPage } from './pages/carrier-pages/CarrierDeliveryOrder';
import { MainPage as CarrierMainPage } from './pages/carrier-pages/MainPage';
import { CreateAuction } from './pages/farmer-pages/CreateAuction';
import { Farms } from './pages/farmer-pages/Farms';
import { MainPage as FarmerMainPage } from './pages/farmer-pages/MainPage';
import { MyAuctions } from './pages/farmer-pages/MyAuctions';
import { ProductsPage } from './pages/farmer-pages/ProductsPage';
import { UpdateAuction } from './pages/farmer-pages/UpdateAuction';
import { StripeDeliveryOrderPaymentPage } from './pages/businessman-pages/DeliveryOrderPaymentPage';
import { CarrierOffers } from './pages/carrier-pages/CarrierOffers';
import { Transport } from './pages/carrier-pages/Transport';
import { Drivers } from './pages/carrier-pages/Drivers';
import { DeliveriesPage } from './pages/carrier-pages/DeliveriesPage';
import { Deliveries } from './pages/driver-pages/Deliveries';
import { DeliveryDetails } from './pages/driver-pages/DeliveryDetails';
import { MainPage as DriverMainPage } from './pages/driver-pages/MainPage';

type Route = {
  path: string;
  Component: () => React.ReactNode;
};

export const driverRoutes: Route[] = [
  {
    path: AppRoute.Driver.Deliveries,
    Component: Deliveries
  },
  {
    path: AppRoute.Driver.DeliveryDetails,
    Component: DeliveryDetails
  },
  {
    path: AppRoute.General.Notifications,
    Component: Notifications
  },
  {
    path: AppRoute.General.Main,
    Component: DriverMainPage
  }
]

export const generalRoutes: Route[] = [
  {
    path: AppRoute.General.Notifications,
    Component: Notifications
  },
  {
    path: AppRoute.General.Payments,
    Component: PaymentsPage
  },
  {
    path: AppRoute.General.StripeRefresh,
    Component: StripeRefreshPage
  },
  {
    path: AppRoute.General.StripeRegister,
    Component: StripeRegisterPage
  },
  {
    path: AppRoute.General.StripeReturn,
    Component: StripeReturnPage
  }
];

export const carrierRoutes: Route[] = [
  {
    path: AppRoute.General.Main,
    Component: CarrierMainPage
  },
  {
    path: AppRoute.Carrier.DeliveryOrders,
    Component: CarrierDeliveryOrderPage
  },
  {
    path: AppRoute.General.Notifications,
    Component: Notifications
  },
  {
    path: AppRoute.General.DeliveryOrder,
    Component: DeliveryOrderDetails
  },
  {
    path: AppRoute.Carrier.DeliveryOffers,
    Component: CarrierOffers
  },
  {
    path: AppRoute.Carrier.Deliveries,
    Component: DeliveriesPage
  },
  {
    path: AppRoute.Carrier.Transport,
    Component: Transport
  },
  {
    path: AppRoute.Carrier.Drivers,
    Component: Drivers
  }
];

export const businessRoutes: Route[] = [
  {
    path: AppRoute.Businessman.DeliveryOrderPaymentPage,
    Component: StripeDeliveryOrderPaymentPage
  },
  {
    path: AppRoute.General.Main,
    Component: BusinessmanMainPage
  },
  {
    path: AppRoute.Businessman.ProductAuctionPaymentPage,
    Component: StripeProductAuctionPaymentPage
  },
  {
    path: AppRoute.Businessman.Depots,
    Component: Depots
  },
  {
    path: AppRoute.Businessman.Bids,
    Component: MyBids
  },
  {
    path: AppRoute.Businessman.Delivery,
    Component: BusinessDeliveryOrderPage
  },
  {
    path: AppRoute.General.Auctions,
    Component: AllAuction
  },
  {
    path: AppRoute.General.AuctionDetails,
    Component: AuctionDetailsPage
  },
  {
    path: AppRoute.General.DeliveryOrder,
    Component: DeliveryOrderDetails
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
  },
  {
    path: AppRoute.General.Auctions,
    Component: AllAuction
  },
  {
    path: AppRoute.General.AuctionDetails,
    Component: AuctionDetailsPage
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
