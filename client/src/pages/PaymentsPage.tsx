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

type PaymentTypeMapItem = {
  detailsText: string;
  generatePath: (id: string) => string;
  payText: string;
};

const createName = (from: string, to: string) => `${capitalize(from)} to ${capitalize(to)}`;

const targetTypeMap: Record<PaymentTargetType, PaymentTypeMapItem> = {
  [PaymentTargetType.DeliveryOrder]: {
    generatePath: (id: string) => generatePath(AppRoute.General.DeliveryOrder, { deliveryOrderId: id }),
    detailsText: 'Order details',
    payText: 'Pay for the order'
  },
  [PaymentTargetType.ProductAuction]: {
    generatePath: (id: string) => generatePath(AppRoute.General.AuctionDetails, { auctionId: id }),
    detailsText: 'Auction details',
    payText: 'Pay for the product'
  }
} as const;

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
          const uiForTarget = targetTypeMap[payment.targetType];

          const productName =
            payment.targetType === PaymentTargetType.DeliveryOrder
              ? payment.target.productAuction.product.name
              : payment.target.product.name;
          const to =
            payment.targetType === PaymentTargetType.DeliveryOrder
              ? payment.target.productAuction.product.facilityDetails.name
              : payment.target.product.facilityDetails.name;

          const name = createName(productName, to);

          const details = (
            <div className="flex w-full justify-between px-8 pt-4">
              <div className="flex flex-row items-end">
                <Button variant="outline" onClick={() => navigate(uiForTarget.generatePath(payment.target.id))}>
                  {uiForTarget.detailsText}
                </Button>
              </div>
              {user?.role === UserRole.Businessman && payment.status === PaymentStatus.WaitingPayment && (
                <Button
                  onClick={() => navigate(uiForTarget.generatePath(payment.target.id))}
                  type="button"
                  className=" bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  {uiForTarget.payText}
                </Button>
              )}
            </div>
          );

          return (
            <AccordionItem value={payment.id} key={payment.id}>
              <AccordionTrigger className="[&_svg]:w-8">
                <div className="flex w-full flex-row justify-between px-2">
                  <div className="grid w-full grid-cols-1 gap-2 border-r-2 md:grid-cols-1  lg:grid-cols-5 lg:gap-0 lg:border-r-0">
                    <div className="flex items-center justify-center px-4 font-bold lg:border-r-2">
                      {user && getPaymentType({ payment, user })}
                    </div>
                    <div className="flex items-center justify-center px-4 font-bold lg:border-r-2">
                      {user && getFormattedAmount({ payment, user })}
                    </div>
                    <div className="flex items-center justify-center px-4 lg:border-r-2">{name}</div>
                    <div className="flex items-center justify-center text-center text-gray-500 lg:border-r-2">
                      <span>({format(parseISO(payment.updatedAt), 'dd-MM-yyyy HH:mm:ss')})</span>
                    </div>
                    <div
                      className={cn(
                        'm-auto h-min w-max whitespace-nowrap rounded-lg  p-2 text-center text-sm',
                        productAuctionStatus[payment.status]
                      )}
                    >
                      {ProductAuctionStatusText[payment.status]}
                    </div>
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
