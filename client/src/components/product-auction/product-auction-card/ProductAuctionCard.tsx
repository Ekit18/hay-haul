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
import { useNavigate } from 'react-router-dom';
import { productAuctionStatus } from './ProductAuctionStatus.enum';

type ProductAuctionCardProps = {
  productAuction: ProductAuction;
  onDeleteClick: () => void;
};

export function ProductAuctionCard({ productAuction, onDeleteClick }: ProductAuctionCardProps) {
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();

  return (
    <div className="min-[1068px]:w-full w-full flex flex-col min-[1068px]:flex-row gap-4 justify-start items-center rounded-lg bg-white">
      <div className="w-full min-[1068px]:h-full min-[1068px]:w-4/12 xl:w-3/12">
        <img
          className="h-40 min-[1068px]:h-full w-full  object-cover min-[1068px]:rounded-l-lg rounded-t-lg min-[1068px]:rounded-tr-none"
          src={productAuction?.photos[0]?.signedUrl}
          alt={productAuction.product.name}
        />
      </div>
      <div className="w-full min-[1068px]:py-4 min-[1068px]:w-5/12 xl:w-6/12">
        <div className="w-full flex flex-col min-[1068px]:pr-4 px-4 gap-4 min-[1068px]:border-r-2">
          <div className="flex flex-row justify-start items-center gap-3">
            <p className="font-semibold text-xl text-left w-max">
              {capitalize(productAuction.product.name)} by {capitalize(productAuction.product.facilityDetails.name)}
              <br />
              {productAuction.id}
            </p>
            <p
              className={cn(
                'w-max p-2 rounded-lg text-sm whitespace-nowrap',
                productAuctionStatus[productAuction.auctionStatus]
              )}
            >
              {ProductAuctionStatusText[productAuction.auctionStatus]}
            </p>
          </div>

          <div className="w-full flex flex-row justify-left gap-4">
            <p>
              Start date:{' '}
              <span className="font-medium">{format(parseISO(productAuction.startDate), 'yyyy-MM-dd')}</span>
            </p>
            <p>
              End date: <span className="font-medium">{format(parseISO(productAuction.endDate), 'yyyy-MM-dd')}</span>
            </p>
          </div>
          <p className="bg-gray-100 rounded p-2 w-full text-base">
            {productAuction.description.length > 100 ? (
              <>
                {productAuction.description.substring(0, 100).trimEnd()}...
                {/* TODO redirect user to auction */}
                <Button className="text-base p-0 h-min" variant="link">
                  Learn more
                </Button>
              </>
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
      <div className="min-[1068px]:pr-4 px-4 pb-4 gap-4 flex flex-col min-[1068px]:py-4 min-[1068px]:pl-0 min-[1068px]:w-3/12 w-full">
        {(productAuction.auctionStatus === ProductAuctionStatus.Active ||
          productAuction.auctionStatus === ProductAuctionStatus.EndSoon) && (
          <div className="border-b-2 pb-4">
            <p className="text-center">Ends in:</p>
            <Timer toDate={productAuction.endDate} />
          </div>
        )}
        {productAuction.auctionStatus === ProductAuctionStatus.StartSoon && (
          <div className="border-b-2 pb-4">
            <p className="text-center">Starts in:</p>
            <Timer toDate={productAuction.startDate} className="text-blue-600" />
          </div>
        )}
        <div className="w-full text-center flex flex-col gap-2">
          <p>Current price:</p>
          <p className="font-bold text-2xl">
            {productAuction.currentMaxBid?.price ? `${productAuction.currentMaxBid?.price} USD` : 'No bets'}
          </p>
        </div>
        <div className="w-full text-center flex flex-col gap-2">
          {user?.role === UserRole.Businessman && (
            <>
              <Button className="w-full text-primary border-primary border" variant="outline">
                Place a bet
              </Button>
              <Button className="w-full">Buy now for {productAuction.buyoutPrice}</Button>
            </>
          )}
          {/* {user?.id === productAuction.product.facilityDetails.user?.id && ( */}
          <>
            <Button
              type="button"
              className="w-full"
              disabled={
                !(
                  [ProductAuctionStatus.Inactive, ProductAuctionStatus.StartSoon] as ProductAuctionStatusValues[]
                ).includes(productAuction.auctionStatus)
              }
              onClick={() => navigate(`${AppRoute.Farmer.UpdateAuction}/${productAuction.id}`)}
            >
              Update
            </Button>
            <Button type="button" className="w-full" variant="destructive" onClick={onDeleteClick}>
              Delete
            </Button>
          </>
          {/* )} */}
        </div>
      </div>
    </div>
  );
}
