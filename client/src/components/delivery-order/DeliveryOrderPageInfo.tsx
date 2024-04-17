import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { DeliveryOrder } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { DataWithCount } from '@/lib/types/types';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryActionCreatorResult,
  QueryDefinition
} from '@reduxjs/toolkit/query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { DeliveryOrderCard } from './card/DeliveryOrderCard';
import { CreateDeliveryOrderModalHOC } from './modals/create-delivery-order/CreateDeliveryOrderModal';

export type DeliveryOrderPageInfoProps = {
  deliveryOrders: DataWithCount<DeliveryOrder> | undefined;
  isFetching: boolean;
  isLoading: boolean;
  trigger: (
    arg: URLSearchParams,
    preferCacheValue?: boolean | undefined
  ) => QueryActionCreatorResult<
    QueryDefinition<
      URLSearchParams,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, unknown, FetchBaseQueryMeta>,
      'DeliveryOrder',
      DataWithCount<unknown>,
      'api'
    >
  >;
};

export function DeliveryOrderPageInfo({ trigger, deliveryOrders, isFetching, isLoading }: DeliveryOrderPageInfoProps) {
  const user = useAppSelector((state) => state.user.user);
  useEffect(() => {
    trigger(new URLSearchParams());
  }, []);
  if (isFetching || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  console.log(deliveryOrders);

  if (!user) return null;

  if (deliveryOrders?.count === 0) {
    <div className="flex h-full w-full items-center justify-center">
      <h3 className="text-xl font-bold">No delivery orders</h3>
    </div>;
  }
  return (
    <div className="">
      <div className="flex flex-col gap-2">
        <div className="bg-white p-4">
          <h2 className="mb-9 mt-6 text-3xl font-bold">Delivery orders</h2>
        </div>
        {user?.role === UserRole.Businessman && (
          <div className="flex w-full justify-end pr-5">
            <CreateDeliveryOrderModalHOC />
          </div>
        )}
        <div className="grid w-full grid-cols-1 gap-4 px-4 pt-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
          {deliveryOrders?.data.map((deliveryOrder) => (
            <DeliveryOrderCard key={deliveryOrder.id} deliveryOrder={deliveryOrder} />
          ))}
        </div>
      </div>
    </div>
  );
}
