import { useAppSelector } from '@/lib/hooks/redux';
import { Delivery } from '@/lib/types/Delivery/Delivery.type';
import { DataWithCount } from '@/lib/types/types';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryActionCreatorResult,
  QueryDefinition
} from '@reduxjs/toolkit/query';
import {
  DeliveriesFilterFormValues,
  deliveriesFilterFormDefaultValues,
  useDeliveriesFilterFormSchema
} from './deliveries-filter/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import useInfiniteScroll from '@/lib/hooks/useInfiniteScroll';
import debounce from 'debounce';
import { DEBOUNCE_DELAY } from '@/lib/constants/constants';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DeliveriesFilter } from './deliveries-filter/DeliveriesFilter';
import { Form } from '../ui/form';
import { DeliveryCard } from './cards/DeliveryCard';
import { toast } from '../ui/use-toast';
import { DeleteModal } from '../delete-modal/delete-modal';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { deliveryApi } from '@/store/reducers/delivery/deliveryApi';
import { UpdateDeliveryModal } from './modals/update-delivery/UpdateDeliveryModal';

export type DeliveriesPageInfoProps = {
  deliveries: DataWithCount<Delivery> | undefined;
  isFetching: boolean;
  isLoading: boolean;
  trigger: (
    arg: URLSearchParams,
    preferCacheValue?: boolean | undefined
  ) => QueryActionCreatorResult<
    QueryDefinition<
      URLSearchParams,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, unknown, FetchBaseQueryMeta>,
      'Deliveries',
      DataWithCount<unknown>,
      'api'
    >
  >;
  label: string;
};

export function DeliveriesPageInfo({
  trigger,
  deliveries: data,
  isFetching,
  isLoading,
  label
}: DeliveriesPageInfoProps) {
  const user = useAppSelector((state) => state.user.user);
  const deliveriesFilterFormSchema = useDeliveriesFilterFormSchema();
  const [defaultValues, setDefaultValues] = useState<DeliveriesFilterFormValues>(deliveriesFilterFormDefaultValues);
  const form = useForm<DeliveriesFilterFormValues>({
    resolver: yupResolver(deliveriesFilterFormSchema),
    mode: 'onSubmit',
    defaultValues
  });

  useEffect(() => {
    trigger(new URLSearchParams());
  }, []);

  const onSubmit: SubmitHandler<DeliveriesFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();

    const { deliveriesStatus, innerSortKey, innerSortOrder, ...body } = data;

    Object.entries(body).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });

    if (innerSortKey && innerSortOrder) {
      searchParams.append(innerSortKey, innerSortOrder);
    }

    if (deliveriesStatus && deliveriesStatus.length) {
      searchParams.append('deliveriesStatus', deliveriesStatus?.join(',') ?? '');
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

  const [deleteDelivery] = deliveryApi.useDeleteDeliveryMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [chosenDelivery, setChosenDelivery] = useState<Delivery | null>(null);

  const handleDeleteDelivery = async () => {
    if (!chosenDelivery) {
      return;
    }

    await deleteDelivery(chosenDelivery.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Delivery deleted',
          description: 'Delivery has been deleted successfully.'
        });
        setOpenDeleteModal(false);
      })
      .catch(handleRtkError);
  };

  const handleDeleteClick = (delivery: Delivery) => {
    setChosenDelivery(delivery);
    setOpenDeleteModal(true);
  };

  const handleUpdateClick = (delivery: Delivery) => {
    setChosenDelivery(delivery);
    setOpenUpdateModal(true);
  };

  const handleOpenDeleteChange = (open: boolean) => {
    if (!open) {
      setOpenDeleteModal(false);
      setChosenDelivery(null);
    }
  };

  const handleOpenUpdateChange = (open: boolean) => {
    if (!open) {
      setOpenUpdateModal(false);
      setChosenDelivery(null);
    }
  };

  if (!user) return null;

  return (
    <div className="h-full bg-gray-100 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" flex h-full flex-col">
          <div className="bg-white p-4 pt-10">
            <h2 className="mb-9 text-3xl font-bold">{label}</h2>
            <DeliveriesFilter />
          </div>
          {isFetching || isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          ) : data?.count === 0 ? (
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
              {data?.data.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onEditClick={function (): void {
                    handleUpdateClick(delivery);
                  }}
                  onDeleteClick={function (): void {
                    handleDeleteClick(delivery);
                  }}
                />
              ))}

              {!!data?.data && <div ref={loadMoreRef} className="h-5 w-5" />}
            </div>
          )}
        </form>
      </Form>
      {chosenDelivery && (
        <>
          <DeleteModal
            name={'DELIVERY'}
            open={openDeleteModal}
            handleOpenChange={handleOpenDeleteChange}
            deleteCallback={handleDeleteDelivery}
            entityTitle={EntityTitle.Delivery}
          />
          <UpdateDeliveryModal
            delivery={chosenDelivery}
            handleOpenChange={handleOpenUpdateChange}
            open={openUpdateModal}
          />
        </>
      )}
    </div>
  );
}
