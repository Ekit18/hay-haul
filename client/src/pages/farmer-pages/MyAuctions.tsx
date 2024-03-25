import { ProductAuctionCard } from '@/components/product-auction/product-auction-card/ProductAuctionCard';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { useCallback, useMemo, useState } from 'react';

export function MyAuctions() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const { data: productAuctions } = productAuctionApi.useFilterProductAuctionsQuery(new URLSearchParams({ limit: 10 }));

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
      <div className="p-4 pt-6 bg-white">
        <h2 className="text-3xl font-bold mb-9">My auctions</h2>
      </div>
      <div className="px-4">{/* <CreateProductAuctionModal entityTitle={EntityTitle.Farm} /> */}</div>
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
    </div>
  );
}
