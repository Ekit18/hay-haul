export const productAuctionBidTrigger = `
create or alter trigger product_auction_max_bid_trigger
on product_auction_bid
after insert
as
begin
  if
  (select price from inserted)
  <=
  (SELECT bid.price 
    FROM product_auction auction
    INNER JOIN product_auction_bid bid ON auction.currentMaxBidId = bid.id
    WHERE auction.id = (select auctionId from inserted))
  begin
    raiserror ('New bid amount cannot be less than the maximum bid', 16, 1);
    rollback transaction;
  end
end;
`;
