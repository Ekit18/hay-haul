import { GET_AUCTION_MAX_BID_FUNCTION_NAME } from 'src/function/function-data/auction.function';

export const UPDATE_AUCTION_TRIGGER_NAME = 'update_auction';
export const UPDATE_AUCTION_STATUS_TRIGGER_NAME = 'delete_auction_bids';
export const updateAuctionTrigger = `
create or alter trigger ${UPDATE_AUCTION_TRIGGER_NAME}
on product_auction
after update
as
begin
declare @auctionStatus varchar(255);
select @auctionStatus=auctionStatus from deleted;

if (@auctionStatus != 'Active')
begin
     return;
end    

 declare @isStartDataModified bit;
 declare @newBuyoutPrice float;

 select @isStartDataModified = case when (
      (ins.startDate != del.startDate) or (ins.startPrice != del.startPrice)
 ) then 1 else 0 end, @newBuyoutPrice = ins.buyoutPrice
 from deleted del inner join inserted ins on del.id=ins.id

 if(@isStartDataModified = 1)
 begin
  raiserror ('Cannot edit start date or start price of started auction', 16, 1);
  rollback transaction;
 end

 declare @isNewBuyoutPriceLessThenMaxBid bit;

 select @isNewBuyoutPriceLessThenMaxBid = case when (
 @newBuyoutPrice < maxBid.price
 ) then 1 else 0 end from inserted ins cross apply ${GET_AUCTION_MAX_BID_FUNCTION_NAME}(ins.id) maxBid

 if(@isNewBuyoutPriceLessThenMaxBid = 1)
 begin
      raiserror ('Buyout price cannot be less then max bid', 16, 1);
      rollback transaction;
 end
end
`;

export const updateAuctionStatusTrigger = `
create or alter trigger ${UPDATE_AUCTION_STATUS_TRIGGER_NAME}
on product_auction
after update
as
declare @auctionId varchar(255), @prevStatus varchar(50)
select @auctionId = id, @prevStatus = auctionStatus from deleted
if @prevStatus = 'Unpaid'
begin
begin tran
begin try
update product_auction set currentMaxBidId=NULL where id=@auctionId
delete from product_auction_bid where auctionId = @auctionId
commit tran
end try
begin catch
rollback tran
end catch
end
`;
