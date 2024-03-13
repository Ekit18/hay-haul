import { PartialType } from '@nestjs/swagger';
import { CreateProductAuctionDto } from './create-product-auction.dto';

export class UpdateProductAuctionDto extends PartialType(
  CreateProductAuctionDto,
) {
  // /**
  //  * Updatable only if {@link ProductAuction.status} === {@link AuctionStatus.Inactive}
  //  */
  // startPrice: number;
  // /**
  //  * Always updatable
  //  */
  // buyoutPrice: number;
  // /**
  //  * Updatable only if {@link ProductAuction.status} === {@link AuctionStatus.Inactive}
  //  */
  // startDate: Date;
  // /**
  //  * Updatable only if {@link ProductAuction.status} === {@link AuctionStatus.Inactive}
  //  */
  // endDate: Date;
  // /**
  //  * Updatable only if {@link ProductAuction.status} === {@link AuctionStatus.Inactive}
  //  */
  // paymentPeriod: Date;
}
