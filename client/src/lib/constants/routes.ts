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
    Drivers: '/drivers'
  }
} as const;
