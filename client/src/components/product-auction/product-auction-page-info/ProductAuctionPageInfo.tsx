import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { DEBOUNCE_DELAY } from '@/lib/constants/constants';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { DataWithCount } from '@/lib/types/types';
import { cn } from '@/lib/utils';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryActionCreatorResult,
  QueryDefinition
} from '@reduxjs/toolkit/query';
import debounce from 'debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ProductAuctionCard } from '../product-auction-card/ProductAuctionCard';
import { ProductAuctionCardSkeleton } from '../product-auction-card/ProductAuctionCard.skeleton';
import { ProductAuctionFilter } from '../product-auction-filter/ProductAuctionFilter';
import {
  ProductAuctionFilterFormValues,
  productAuctionFilterFormDefaultValues,
  useProductAuctionFilterFormSchema
} from '../product-auction-filter/validation';

type AuctionsProps = {
  trigger: (
    arg: URLSearchParams,
    preferCacheValue?: boolean | undefined
  ) => QueryActionCreatorResult<
    QueryDefinition<
      URLSearchParams,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, unknown, FetchBaseQueryMeta>,
      'Product' | 'ProductAuction',
      DataWithCount<unknown>,
      'api'
    >
  >;
  data: DataWithCount<ProductAuction> | undefined;
  isLoading: boolean;
  isFetching: boolean;
  pageLabel: string;
};

function ProductAuctionPageInfo({ trigger, data, isLoading, isFetching, pageLabel }: AuctionsProps) {
  const productAuctionFilterFormSchema = useProductAuctionFilterFormSchema();
  const form = useForm<ProductAuctionFilterFormValues>({
    resolver: yupResolver(productAuctionFilterFormSchema),
    mode: 'onSubmit',
    defaultValues: productAuctionFilterFormDefaultValues
  });

  const onSubmit: SubmitHandler<ProductAuctionFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();

    const { statuses, innerSortKey, innerSortOrder, ...body } = data;

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

    if (statuses && statuses.length) {
      searchParams.append('statuses', statuses?.join(',') ?? '');
    }
    await trigger(searchParams).unwrap().catch(handleRtkError);
  };

  const firstRender = useRef(true);
  useEffect(() => {
    const getFunction = () => {
      if (!isLoading || !isFetching) {
        onSubmit(form.getValues());
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

  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const [currentProductAuction, setCurrentProductAuction] = useState<ProductAuction>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const handleDeleteModalOpenChange = useCallback((open: boolean) => setIsDeleteModalOpen(open), []);

  const deleteModalConfirmName = useMemo<string>(
    () => currentProductAuction?.product.name ?? '>',
    [currentProductAuction]
  );

  const handleDeleteClick = (facility: ProductAuction) => {
    setCurrentProductAuction(facility);
    setIsDeleteModalOpen(true);
  };

  const [deleteProductAuction] = productAuctionApi.useDeleteProductAuctionMutation();

  const handleDeleteProductAuction = async () => {
    if (!currentProductAuction) return;

    await deleteProductAuction(currentProductAuction.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Auction deleted',
          description: 'Your auction has been deleted successfully.'
        });
      })
      .finally(() => setIsDeleteModalOpen(false))
      .catch(handleRtkError);
  };

  return (
    <div className="h-full bg-gray-100 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" flex h-full flex-col">
          <div className=" bg-white p-4 pt-10">
            <h2 className="mb-9 text-3xl font-bold">{pageLabel}</h2>
            <ProductAuctionFilter />
          </div>
          <div
            className={cn(
              'grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 pt-5',
              data?.data && data?.data.length >= 3 && 'pb-5'
            )}
          >
            {isLoading &&
              isFetching &&
              (Array.from({ length: 3 }, (_, i) => i) as number[]).map((value) => (
                <ProductAuctionCardSkeleton key={value} />
              ))}

            {data?.data.map((productAuction) => (
              <ProductAuctionCard
                key={productAuction.id}
                productAuction={productAuction}
                onDeleteClick={() => handleDeleteClick(productAuction)}
              />
            ))}

            {data?.data.length === 0 && (
              <div className="text-center">
                <p className="text-2xl font-bold">0 Results found</p>
                <p>Try changing the filters</p>
              </div>
            )}
          </div>
        </form>
      </Form>
      {currentProductAuction && (
        <>
          <DeleteModal
            handleOpenChange={handleDeleteModalOpenChange}
            open={isDeleteModalOpen}
            name={deleteModalConfirmName}
            entityTitle={EntityTitle.ProductAuction}
            deleteCallback={handleDeleteProductAuction}
          />
        </>
      )}
    </div>
  );
}

export default ProductAuctionPageInfo;
