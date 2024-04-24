import { productAuctionStatus } from '@/components/product-auction/product-auction-card/ProductAuctionStatus.enum';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { AppRoute } from '@/lib/constants/routes';
import { PaymentStatus } from '@/lib/enums/payment-status.enum';
import { PaymentTargetType } from '@/lib/enums/payment-target-type.enum';
import { UserRole } from '@/lib/enums/user-role.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import useInfiniteScroll from '@/lib/hooks/useInfiniteScroll';
import { Payment } from '@/lib/types/Payments/Payment';
import { ProductAuctionStatusText } from '@/lib/types/ProductAuction/ProductAuction.type';
import { User } from '@/lib/types/User/User.type';
import { cn } from '@/lib/utils';
import { paymentsApi } from '@/store/reducers/payments/paymentsApi';
import { format, parseISO } from 'date-fns';
import capitalize from 'lodash.capitalize';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

export function PaymentsPage() {
  const [getPaymentsByUserId, { data, isLoading, isError, error }] = paymentsApi.useLazyGetPaymentsByUserIdQuery();
  const { loadMoreRef, page: currentPage } = useInfiniteScroll({ maxPage: data?.count });
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams();

    if (currentPage) {
      searchParams.append('offset', (currentPage * 10).toString());
    }

    getPaymentsByUserId(searchParams);
  }, [currentPage]);

  useEffect(() => {
    if (isError) {
      handleRtkError(error);
      navigate(AppRoute.General.Main);
    }
  }, [isError, error]);

  if (isLoading || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  let content = null;
  if (data.data.length === 0) {
    content = <h2 className="text-xl font-bold">No payments</h2>;
  } else {
    content = (
      <Accordion type="single" collapsible>
        {data.data.map((payment) => {
          let name = '';
          let details = null;
          if (payment.targetType === PaymentTargetType.DeliveryOrder) {
            name = `${capitalize(payment.target.productAuction.product.name)} by ${capitalize(payment.target.productAuction.product.facilityDetails.name)}`;
            details = (
              <div className="flex w-full justify-between pt-4">
                <div className="flex flex-row items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(generatePath(AppRoute.General.DeliveryOrder, { deliveryOrderId: payment.target.id }))
                    }
                  >
                    Order details
                  </Button>
                </div>
                {user?.role === UserRole.Businessman && payment.status === PaymentStatus.WaitingPayment && (
                  <Button
                    onClick={() =>
                      navigate(generatePath(AppRoute.General.DeliveryOrder, { deliveryOrderId: payment.target.id }))
                    }
                    type="button"
                    className=" bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Pay for the order
                  </Button>
                )}
              </div>
            );
          } else {
            name = `${capitalize(payment.target.product.name)} by ${capitalize(payment.target.product.facilityDetails.name)}`;
            details = (
              <div className="flex w-full justify-between pt-4 ">
                <div className="flex flex-row items-end">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: payment.target.id }))
                    }
                  >
                    Auction details
                  </Button>
                </div>
                {user?.role === UserRole.Businessman && payment.status === PaymentStatus.WaitingPayment && (
                  <Button
                    onClick={() =>
                      navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: payment.target.id }))
                    }
                    type="button"
                    className=" bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Pay for the product
                  </Button>
                )}
              </div>
            );
          }

          return (
            <AccordionItem value={payment.id} key={payment.id}>
              <AccordionTrigger>
                <div className="flex w-full flex-row justify-between px-2">
                  <div className="flex w-full grid-cols-4">
                    <div className="border-r-2 px-4 font-bold">{user && getPaymentType({ payment, user })}</div>
                    <div className="border-r-2 px-4 font-bold">{user && getFormattedAmount({ payment, user })}</div>
                    <div className="px-4">{name}</div>
                    <div className="ml-auto pr-4 text-gray-500">
                      ({format(parseISO(payment.updatedAt), 'dd-MM-yyyy HH:mm:ss')})
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                      productAuctionStatus[payment.status]
                    )}
                  >
                    {ProductAuctionStatusText[payment.status]}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>{details}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div className="bg-white p-4">
          <h2 className="mb-9 mt-6 text-3xl font-bold">Payments</h2>
        </div>
      </div>
      <div className="px-4">{content}</div>
      {!!data?.data && <div ref={loadMoreRef} className="h-5 w-5" />}
    </div>
  );
}

export enum PaymentType {
  Buy = 'Buy',
  Sell = 'Sell'
}

function getFormattedAmount({ payment, user }: { payment: Payment; user: User }): string {
  return `${getPaymentType({ payment, user }) === PaymentType.Sell ? '+' : '-'} ${payment.amount} USD`;
}

function getPaymentType({ payment, user }: { payment: Payment; user: User }): PaymentType {
  return payment.sellerId === user.id ? PaymentType.Sell : PaymentType.Buy;
}
