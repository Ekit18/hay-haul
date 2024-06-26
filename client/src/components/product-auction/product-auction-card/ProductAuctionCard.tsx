import { Timer } from '@/components/timer/Timer';
import { Button } from '@/components/ui/button';
import {
  ProductAuction,
  ProductAuctionStatus,
  ProductAuctionStatusText,
  ProductAuctionStatusValues
} from '@/lib/types/ProductAuction/ProductAuction.type';

import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import capitalize from 'lodash.capitalize';
import { Crown } from 'lucide-react';
import { generatePath, useNavigate } from 'react-router-dom';
import { RestartAuctionModal } from '../modals/restart-auction-modal/RestartAuctionModal';
import { productAuctionStatus } from './ProductAuctionStatus.enum';

type ProductAuctionCardProps = {
  productAuction: ProductAuction;
  onDeleteClick: () => void;
};

export function ProductAuctionCard({ productAuction, onDeleteClick }: ProductAuctionCardProps) {
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();

  const isAuctionWinner = productAuction.currentMaxBid?.userId === user?.id;

  return (
    <div className="flex w-full flex-col items-center justify-start gap-4 rounded-lg bg-white min-[1068px]:w-full min-[1068px]:flex-row">
      <Button
        variant="link"
        type="button"
        onClick={() => navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))}
        className="h-40 w-full min-w-[300px] p-0 min-[1068px]:h-full min-[1068px]:w-4/12 xl:w-3/12"
      >
        <img
          className="h-full w-full rounded-t-lg  object-cover min-[1068px]:h-full min-[1068px]:rounded-l-lg min-[1068px]:rounded-tr-none"
          src={productAuction?.photos[0]?.signedUrl}
          alt={productAuction.product.name}
        />
      </Button>
      <div className="w-full min-[1068px]:w-5/12 min-[1068px]:py-4 xl:w-6/12">
        <div className="flex w-full flex-col gap-4 px-4 min-[1068px]:border-r-2 min-[1068px]:pr-4">
          <div className="flex flex-row items-center justify-start gap-3">
            <Button
              onClick={() => navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))}
              variant="link"
              className="h-auto w-max text-wrap p-0 text-left text-xl font-semibold text-black"
            >
              {capitalize(productAuction.product.name)} by {capitalize(productAuction.product.facilityDetails.name)}
            </Button>
            <p
              className={cn(
                'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                productAuctionStatus[productAuction.auctionStatus]
              )}
            >
              {ProductAuctionStatusText[productAuction.auctionStatus]}
            </p>
          </div>

          <div className="justify-left flex w-full flex-row gap-4">
            <p>
              Start date:{' '}
              <span className="font-medium">{format(parseISO(productAuction.startDate), 'yyyy-MM-dd')}</span>
            </p>
            <p>
              End date: <span className="font-medium">{format(parseISO(productAuction.endDate), 'yyyy-MM-dd')}</span>
            </p>
          </div>
          <p className="w-full rounded bg-gray-100 p-2 text-base">
            {productAuction.description.length > 100 ? (
              <>{productAuction.description.substring(0, 100).trimEnd()}...</>
            ) : (
              productAuction.description
            )}
          </p>
          <p>
            Address of farm: <span className="font-medium">{productAuction.product.facilityDetails.address}</span>
          </p>
          <p>
            Quantity:{' '}
            <span className="font-medium">
              {productAuction.product.quantity} {productAuction.product.quantity === 1 ? 'tonne' : 'tonnes'}
            </span>
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 px-4 pb-4 min-[1068px]:w-3/12 min-[1068px]:py-4 min-[1068px]:pl-0 min-[1068px]:pr-4">
        {(productAuction.auctionStatus === ProductAuctionStatus.Active ||
          productAuction.auctionStatus === ProductAuctionStatus.EndSoon) && (
          <div className="border-b-2 pb-4">
            <p className="text-center">Ends in:</p>
            <Timer label="Auction ended" toDate={productAuction.endDate} />
          </div>
        )}
        {productAuction.auctionStatus === ProductAuctionStatus.StartSoon && (
          <div className="border-b-2 pb-4">
            <p className="text-center">Starts in:</p>
            <Timer label="Starts soon" toDate={productAuction.startDate} className="text-blue-600" />
          </div>
        )}
        <div className="flex w-full flex-col gap-2 text-center">
          <p>Current price:</p>
          <div className="flex flex-col items-center">
            <p className="text-2xl font-bold">
              {productAuction.currentMaxBid?.price ? `${productAuction.currentMaxBid?.price} USD` : 'No bets'}
            </p>
            {isAuctionWinner && (
              <p className="flex gap-2">
                (YOU) <Crown className="text-yellow-400" />
              </p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col gap-2 text-center">
          {user?.role === UserRole.Businessman &&
            ([ProductAuctionStatus.Active, ProductAuctionStatus.EndSoon] as ProductAuctionStatusValues[]).includes(
              productAuction.auctionStatus
            ) && (
              <>
                <Button
                  onClick={() =>
                    navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))
                  }
                  className="w-full border border-primary text-primary"
                  variant="outline"
                  type="button"
                >
                  Place a bet
                </Button>
                <Button
                  className="w-full"
                  type="button"
                  onClick={() =>
                    navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))
                  }
                >
                  Buy now for {productAuction.buyoutPrice}$
                </Button>
              </>
            )}
          {user?.role === UserRole.Businessman &&
            !([ProductAuctionStatus.Active, ProductAuctionStatus.EndSoon] as ProductAuctionStatusValues[]).includes(
              productAuction.auctionStatus
            ) && (
              <Button
                onClick={() =>
                  navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))
                }
                type="button"
                className="w-full"
              >
                Learn more
              </Button>
            )}
          {user?.id !== productAuction.product.facilityDetails.user?.id && user?.role === UserRole.Farmer && (
            <Button
              onClick={() => navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))}
              type="button"
              className="w-full"
            >
              Learn more
            </Button>
          )}
          {isAuctionWinner && productAuction.auctionStatus === ProductAuctionStatus.WaitingPayment && (
            <Button
              onClick={() => navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))}
              type="button"
              className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Pay for the product
            </Button>
          )}
          {isAuctionWinner &&
            productAuction.auctionStatus === ProductAuctionStatus.Paid &&
            !productAuction.deliveryOrder && (
              <Button
                onClick={() =>
                  navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))
                }
                type="button"
                className="w-full bg-green-700"
              >
                Create delivery order
              </Button>
            )}
          {user?.id === productAuction.product.facilityDetails.user?.id && user?.role === UserRole.Farmer && (
            <>
              {(
                [
                  ProductAuctionStatus.Inactive,
                  ProductAuctionStatus.StartSoon,
                  ProductAuctionStatus.Active
                ] as ProductAuctionStatusValues[]
              ).includes(productAuction.auctionStatus) && (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() =>
                    navigate(generatePath(AppRoute.Farmer.UpdateAuction, { auctionId: productAuction.id }))
                  }
                >
                  Update
                </Button>
              )}
              {(
                [ProductAuctionStatus.Inactive, ProductAuctionStatus.StartSoon] as ProductAuctionStatusValues[]
              ).includes(productAuction.auctionStatus) && (
                <Button type="button" className="w-full" variant="destructive" onClick={onDeleteClick}>
                  Delete
                </Button>
              )}

              <Button
                type="button"
                className="w-full"
                onClick={() =>
                  navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: productAuction.id }))
                }
              >
                Learn more
              </Button>
              {([ProductAuctionStatus.Ended, ProductAuctionStatus.Unpaid] as ProductAuctionStatusValues[]).includes(
                productAuction.auctionStatus
              ) && <RestartAuctionModal id={productAuction.id} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
