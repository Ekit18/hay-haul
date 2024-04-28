export enum OtpType {
  REGISTER = 'REGISTER',
  FORGOT_PASSWORD = 'FORGOT_PASSWORD',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum ComparisonOperator {
  EQUAL,
  NOT_EQUAL,
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL,
  LESS_THAN,
  LESS_THAN_OR_EQUAL,
}

export enum ServerEventName {
  Notification = 'notification',
  AuctionUpdated = 'auction_updated',
  DeliveryUpdated = 'delivery_updated',
  DeliveryOrderUpdated = 'delivery_order_updated',
}

export enum PaymentTargetType {
  ProductAuction = 'product_auction',
  DeliveryOrder = 'delivery_order',
}

export enum PaymentDirection {
  Purchase = 'purchase',
  Sale = 'sale',
}

export enum PaymentStatus {
  WaitingPayment = 'WaitingPayment',
  Paid = 'Paid',
}
