import { ProductAuctionCard } from '@/components/product-auction/product-auction-card/ProductAuctionCard';
import { ProductAuctionFilter } from '@/components/product-auction/product-auction-filter/ProductAuctionFilter';
import {
  ProductAuctionFilterFormValues,
  productAuctionFilterFormDefaultValues,
  useProductAuctionFilterFormSchema
} from '@/components/product-auction/product-auction-filter/validation';
import { Form } from '@/components/ui/form';
import { DEBOUNCE_DELAY } from '@/lib/constants/constants';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { yupResolver } from '@hookform/resolvers/yup';
import debounce from 'debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export function MyAuctions() {
  const productAuctionFilterFormSchema = useProductAuctionFilterFormSchema();
  const form = useForm<ProductAuctionFilterFormValues>({
    resolver: yupResolver(productAuctionFilterFormSchema),
    mode: 'onSubmit',
    defaultValues: productAuctionFilterFormDefaultValues
  });

  const watchedFields = form.watch();
  console.log(form.formState.errors);
  // const [filterFarmerAuctions, { data: productAuctions, isLoading, isFetching, isUninitialized }] =
  //   productAuctionApi.useLazyFilterFarmerProductAuctionsQuery();
  const [filterProductAuctions, { data: productAuctions, isLoading, isFetching, isUninitialized }] =
    productAuctionApi.useLazyFilterProductAuctionsQuery();

  const onSubmit: SubmitHandler<ProductAuctionFilterFormValues> = async (data) => {
    if (isLoading || isFetching) return;

    const searchParams = new URLSearchParams();

    const { statuses, ...body } = data;

    Object.entries(body).forEach(([key, value]) => {
      if (value && typeof value === 'object') {
        const capitalizedNames = key.charAt(0).toUpperCase() + key.slice(1);

        if (value.from) searchParams.append(`min${capitalizedNames}`, value.from.toString());
        if (value.to) searchParams.append(`max${capitalizedNames}`, value.to.toString());
        return;
      }

      if (value) searchParams.append(key, value.toString());
    });

    if (statuses && statuses.length) {
      searchParams.append('statuses', statuses?.join(',') ?? '');
    }
    await filterProductAuctions(searchParams).unwrap().catch(handleRtkError);
  };

  useEffect(() => {
    const debouncedFunction = debounce(
      () => (!isLoading || !isFetching) && (form.trigger(), onSubmit(form.getValues())),
      DEBOUNCE_DELAY
    );

    form.watch(() => {
      debouncedFunction();
    });

    return () => {
      debouncedFunction.clear();
    };
  }, [watchedFields]);

  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const [currentProductAuction, setCurrentProductAuction] = useState<ProductAuction>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const handleDeleteModalOpenChange = useCallback((open: boolean) => setIsDeleteModalOpen(open), []);

  const handleUpdateModalOpenChange = useCallback((open: boolean) => setIsUpdateModalOpen(open), []);

  const deleteModalConfirmName = useMemo<string>(
    () => currentProductAuction?.product.name ?? '>',
    [currentProductAuction]
  );

  const handleEditClick = (facility: ProductAuction) => {
    setCurrentProductAuction(facility);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (facility: ProductAuction) => {
    setCurrentProductAuction(facility);
    setIsDeleteModalOpen(true);
  };

  const [deleteProductAuction] = productAuctionApi.useDeleteProductAuctionMutation();
  const [updateProductAuction] = productAuctionApi.useUpdateProductAuctionMutation();

  const handleUpdateProductAuction = (data: UpdateProductAuctionFormValues) => {
    if (!currentProductAuction) return;

    const { farmProductTypes: _, ...body } = data;

    updateProductAuction({ id: currentProductAuction.id, body })
      .unwrap()
      .finally(() => setIsUpdateModalOpen(false))
      .catch(handleRtkError);
  };

  const handleDeleteProductAuction = () => {
    if (!currentProductAuction) return;

    deleteProductAuction(currentProductAuction.id)
      .unwrap()
      .finally(() => setIsDeleteModalOpen(false))
      .catch(handleRtkError);
  };

  // useEffect(() => {
  //   if (!currentProductAuction) return;

  //   setCurrentProductAuction(data?.find((facility) => facility.id === currentProductAuction.id));
  // }, [data]);

  return (
    <div className=" h-full bg-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="gap-6 mt-6 flex flex-col">
          <div className="p-4 bg-white">
            <h2 className="text-3xl font-bold mb-9">My auctions</h2>
            <ProductAuctionFilter />
          </div>
          <div className="px-4 w-full grid grid-cols-1 gap-4 pt-5 ">
            {productAuctions?.data.map((productAuction) => (
              <ProductAuctionCard
                key={productAuction.id}
                productAuction={productAuction}
                onEditClick={() => handleEditClick(productAuction)}
                onDeleteClick={() => handleDeleteClick(productAuction)}
              />
            ))}
          </div>
        </form>
      </Form>
    </div>
  );
}
