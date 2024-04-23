import { useAppSelector } from '@/lib/hooks/redux';
import { DeliveryOrder, DeliveryOrderStatus } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
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
import { useEffect, useRef } from 'react';
import { DeliveryOrderCard } from './card/DeliveryOrderCard';
import {
  DeliveryOrderFilterFormValues,
  deliveryOrderFilterFormDefaultValues,
  useDeliveryOrderFilterFormSchema
} from './delivery-order-filter/validation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { yupResolver } from '@hookform/resolvers/yup';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import useInfiniteScroll from '@/lib/hooks/useInfiniteScroll';
import debounce from 'debounce';
import { DEBOUNCE_DELAY } from '@/lib/constants/constants';
import { DeliveryOrderFilter } from './delivery-order-filter/DeliveryOrderFilter';
import { cn } from '@/lib/utils';
import { ProductAuctionCardSkeleton } from '../product-auction/product-auction-card/ProductAuctionCard.skeleton';
import { UserRole } from '@/lib/enums/user-role.enum';

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
  label: string;
};

export function DeliveryOrderPageInfo({
  trigger,
  deliveryOrders: data,
  isFetching,
  isLoading,
  label
}: DeliveryOrderPageInfoProps) {
  const user = useAppSelector((state) => state.user.user);
  const deliveryOrderFilterFormSchema = useDeliveryOrderFilterFormSchema();
  const form = useForm<DeliveryOrderFilterFormValues>({
    resolver: yupResolver(deliveryOrderFilterFormSchema),
    mode: 'onSubmit',
    defaultValues: {
      ...deliveryOrderFilterFormDefaultValues,
      ...(user?.role === UserRole.Carrier ? { deliveryOrderStatus: [DeliveryOrderStatus.Active] } : {})
    }
  });

  useEffect(() => {
    trigger(new URLSearchParams());
  }, []);

  const onSubmit: SubmitHandler<DeliveryOrderFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();

    const { deliveryOrderStatus, innerSortKey, innerSortOrder, ...body } = data;

    Object.entries(body).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        const capitalizedNames = key.charAt(0).toUpperCase() + key.slice(1);

        if (value.from) searchParams.append(`min${capitalizedNames}`, value.from.toString());
        if (value.to) searchParams.append(`max${capitalizedNames}`, value.to.toString());
        return;
      }

      if (value) searchParams.append(key, value.toString());
    });

    if (innerSortKey && innerSortOrder) {
      searchParams.append(innerSortKey, innerSortOrder);
    }

    if (deliveryOrderStatus && deliveryOrderStatus.length) {
      searchParams.append('deliveryOrderStatus', deliveryOrderStatus?.join(',') ?? '');
    }
    await trigger(searchParams).unwrap().catch(handleRtkError);
  };

  const { loadMoreRef, page: currentPage, resetPage } = useInfiniteScroll({ maxPage: data?.count });

  useEffect(() => {
    if (!currentPage) return;
    onSubmit({ ...form.getValues(), offset: currentPage * 10 });
  }, [currentPage]);

  const firstRender = useRef(true);
  useEffect(() => {
    const getFunction = () => {
      if (!isLoading || !isFetching) {
        onSubmit(form.getValues());
        resetPage();
      }
    };

    const debouncedFunction = debounce(getFunction, DEBOUNCE_DELAY);

    if (firstRender.current) {
      getFunction();
      firstRender.current = false;
      return;
    }

    const watchSubscription = form.watch(() => {
      debouncedFunction();
    });

    return () => {
      watchSubscription.unsubscribe();
      debouncedFunction.clear();
    };
  }, []);

  if (isFetching || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }
  // console.log(data);

  if (!user) return null;

  return (
    <div className="h-full bg-gray-100 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" flex h-full flex-col">
          <div className="bg-white p-4 pt-10">
            <h2 className="mb-9 text-3xl font-bold">{label}</h2>
            <DeliveryOrderFilter />
          </div>
          {data?.count === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <h3 className="text-xl font-bold">No {label.toLowerCase()}</h3>
            </div>
          ) : (
            <div
              className={cn(
                'grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 py-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3',
                data?.data && data?.data.length >= 3 && 'pb-5'
              )}
            >
              {data?.data.map((deliveryOrder) => (
                <DeliveryOrderCard key={deliveryOrder.id} deliveryOrder={deliveryOrder} />
              ))}

              {!!data?.data && <div ref={loadMoreRef} className="h-5 w-5" />}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
