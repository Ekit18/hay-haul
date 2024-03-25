import { Button } from '@/components/ui/button';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { cn } from '@/lib/utils';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  parseISO
} from 'date-fns';
import capitalize from 'lodash.capitalize';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

type ProductAuctionCardProps = {
  productAuction: ProductAuction;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export function ProductAuctionCard({ productAuction, onDeleteClick, onEditClick }: ProductAuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const end = new Date(productAuction.endDate);
      const diffInSeconds = differenceInSeconds(end, now);

      if (diffInSeconds <= 0) {
        clearInterval(intervalId);
        setTimeLeft('Auction ended');
        return;
      }

      const days = differenceInDays(end, now);
      const hours = differenceInHours(end, now) % 24;
      const minutes = differenceInMinutes(end, now) % 60;
      const seconds = diffInSeconds % 60;
      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [productAuction.endDate]);

  return (
    <div className="min-[1068px]:w-full w-full flex flex-col min-[1068px]:flex-row gap-4 justify-start items-center rounded-lg bg-white">
      <div className="w-full min-[1068px]:h-full min-[1068px]:w-4/12 xl:w-3/12">
        <img
          className="h-40 min-[1068px]:h-full w-full  object-cover min-[1068px]:rounded-l-lg rounded-t-lg"
          src={productAuction?.photos[0]?.signedUrl}
          alt={productAuction.product.name}
        />
      </div>
      <div className="w-full min-[1068px]:py-6 min-[1068px]:w-5/12 xl:w-6/12">
        <div className="w-full flex flex-col min-[1068px]:pr-4 px-4 gap-4 min-[1068px]:border-r-2">
          <div className="font-semibold text-xl text-left w-full">
            {capitalize(productAuction.product.name)} by {capitalize(productAuction.product.facilityDetails.name)}
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
          <p className="w-full bg-gray-100 rounded p-2">{productAuction.description}</p>
          <p className="">
            Address of farm: <span className="font-medium">{productAuction.product.facilityDetails.address}</span>
          </p>
        </div>
      </div>
      <div className="min-[1068px]:pr-6 px-4 pb-4 gap-4 flex flex-col min-[1068px]:py-6 min-[1068px]:w-3/12 w-full">
        <div className="border-b-2 pb-4">
          <p className="text-center">Ends in:</p>
          <div className="flex flex-row items-center gap-1 font-medium justify-center">
            <Clock className="h-5" />{' '}
            <span className={cn('min-w-32 h-6', !timeLeft && 'blur-sm')}>{timeLeft || '0d 00h 00m 00s'}</span>
          </div>
        </div>
        <div className="w-full text-center flex flex-col gap-2">
          <p>Current price:</p>
          <p className="font-bold text-2xl">
            {productAuction.currentMaxBid?.price ? `${productAuction.currentMaxBid?.price} USD` : 'No bets'}
          </p>
          <Button className="w-full" variant="outline">
            Place a bet
          </Button>
          <Button className="w-full">Buy now for {productAuction.buyoutPrice}</Button>
        </div>
      </div>
    </div>
  );
}
