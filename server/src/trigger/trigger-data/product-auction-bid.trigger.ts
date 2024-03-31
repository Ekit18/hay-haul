import { GET_AUCTION_MAX_BID_FUNCTION_NAME } from 'src/function/function-data/auction.function';

export const PRODUCT_AUCTION_MAX_BID_TRIGGER_NAME =
  'product_auction_max_bid_trigger';

export const productAuctionBidTrigger = `
  create or alter trigger ${PRODUCT_AUCTION_MAX_BID_TRIGGER_NAME}
  on product_auction_bid
  after insert, update
  as
  begin
  declare @insertedPrice decimal(18, 2);
	declare @currMax decimal(18,2);
  declare @auctionId varchar(255);
	declare @currUserId varchar(255);
	declare @currWinnerId varchar(255);
    
	select @currUserId = userId, @insertedPrice = price, @auctionId = auctionId from inserted;

	select @currMax=price, @currWinnerId=userId FROM ${GET_AUCTION_MAX_BID_FUNCTION_NAME}(@auctionId);

	if(@currUserId = @currWinnerId)
	begin
		declare @deletedMaxPrice decimal(18,2);
		select @deletedMaxPrice = price from deleted;
		if(@insertedPrice <= @deletedMaxPrice)
		begin
		  raiserror ('New bid amount cannot be less than the maximum bid. Deleted max price: ' + CAST(CAST(@deletedMaxPrice as decimal(18,2)) as VARCHAR) + ' Inserted price: ' + CAST(CAST(@insertedPrice as decimal(18,2)) as VARCHAR), 16, 1);
		  rollback transaction;
		end
	end
    else if (@insertedPrice <= @currMax)
    begin
      raiserror ('New bid amount cannot be less than the maximum bid22', 16, 1);
      rollback transaction;
    end
  end;
  `;
