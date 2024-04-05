export enum ProductAuctionBidErrorMessage {
  FailedCreateProductAuctionBid = 'Failed to create product auction bid',
  IncorrectBidAmountStep = 'New max bid cannot be less than the current max bid plus the bid amount step',
  BidAmountLessThanStartPrice = 'Bid amount should be greater than start price',
  AuctionNotActive = 'Auction is not active or ended',
}
