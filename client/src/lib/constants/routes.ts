// export const MAIN_ROUTE = '/';
// export const SIGN_IN = '/sign-in';
// export const SIGN_UP = '/sign-up';
// export const SUPPORT_ROUTE = '/support';
// export const SEARCH_ROUTE = '/search';
// export const ORDER_ROUTE = '/order';
// export const ORDERS_ROUTE = '/orders';
// export const RESET_PASSWORD = '/reset-password';
// export const OTP_CONFIRM = '/otp-confirm';
// export const PRODUCTS_ROUTE = '/products';
// export const FARMS = '/farms';
// export const FARMER_OFFERS = '/farmer-offers';
// export const AUCTION = '/farmer-auction';

export const AppRoute = {
  General: {
    Main: '/',
    SignIn: '/sign-in',
    SignUp: '/sign-up',
    OtpConfirm: '/otp-confirm',
    ResetPassword: '/reset-password',
    Auctions: '/auctions',
    MyAuctions: '/my-auctions'
  },
  Farmer: {
    Products: '/products',
    Farms: '/farms'
    // MyAuctions: '/my-auctions'
  },
  Businessman: {
    Depots: '/depots',
    Products: '/products',
    Bids: '/bids',
    Delivery: '/delivery'
  }
} as const;
