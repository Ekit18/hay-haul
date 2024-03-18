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
}
