export const AppRoute = {
  General: {
    Main: '/',
    SignIn: '/sign-in',
    SignUp: '/sign-up',
    OtpConfirm: '/otp-confirm',
    StripeRegister: '/stripe/register',
    StripeRefresh: '/stripe/refresh',
    StripeReturn: '/stripe/return',
    ResetPassword: '/reset-password',
    Auctions: '/auctions',
    AuctionDetails: '/auction-details/:auctionId',
    MyAuctions: '/my-auctions',
    Payments: '/payments',
    Notifications: '/notifications',
    DeliveryOrder: '/delivery-order/:deliveryOrderId'
  },
  Farmer: {
    Products: '/products',
    Farms: '/farms',
    CreateAuction: '/create-auction',
    UpdateAuction: '/update-auction/:auctionId'
  },
  Businessman: {
    DeliveryOrderPaymentPage: '/delivery-order/payment/:deliveryOrderId',
    ProductAuctionPaymentPage: '/product-auction/payment/:auctionId',
    Depots: '/depots',
    Products: '/products',
    Bids: '/bids',
    Delivery: '/delivery'
  },
  Carrier: {
    DeliveryOrders: '/delivery-orders',
    DeliveryOffers: '/delivery-offers',
    Transport: '/transport',
    Drivers: '/drivers',
    Deliveries: '/deliveries'
  },
  Driver: {
    Deliveries: '/deliveries',
    DeliveryDetails: '/delivery-details/:deliveryId'
  }
} as const;
