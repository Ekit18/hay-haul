export const GET_AUCTION_MAX_BID_FUNCTION_NAME = 'getAuctionMaxBid';
export const getAuctionMaxBidPriceFunction = `
create or alter function ${GET_AUCTION_MAX_BID_FUNCTION_NAME} (@auctionId varchar(255))
returns table
as return (
    SELECT bid.price as price, bid.userId as userId FROM product_auction auction
    INNER JOIN product_auction_bid bid ON auction.currentMaxBidId = bid.id
    WHERE auction.id = @auctionId
)
`;
