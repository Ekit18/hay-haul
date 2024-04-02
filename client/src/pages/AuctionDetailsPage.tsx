import { ImageCarousel } from '@/components/carousel/FileInputCarousel';
import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { productAuctionStatus } from '@/components/product-auction/product-auction-card/ProductAuctionStatus.enum';
import { Timer } from '@/components/timer/Timer';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { UserRole } from '@/lib/enums/user-role.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import {
  ProductAuctionStatus,
  ProductAuctionStatusText,
  ProductAuctionStatusValues
} from '@/lib/types/ProductAuction/ProductAuction.type';
import { cn } from '@/lib/utils';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, generatePath, useNavigate, useParams } from 'react-router-dom';

export function AuctionDetailsPage() {
  const user = useAppSelector((state) => state.user.user);
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [getProductAuction, { data: productAuction, isFetching, isError }] =
    productAuctionApi.useLazyGetProductAuctionQuery();

  useEffect(() => {
    if (!auctionId) {
      return;
    }
    getProductAuction(auctionId);
  }, [auctionId]);
  const [deleteProductAuction] = productAuctionApi.useDeleteProductAuctionMutation();

  if (!auctionId || isError) {
    return <Navigate to={generatePath(AppRoute.General.Main)} />;
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const handleDeleteModalOpenChange = useCallback((open: boolean) => setIsDeleteModalOpen(open), []);
  const deleteModalConfirmName = useMemo<string>(() => productAuction?.product.name ?? '>', [productAuction]);
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteProductAuction = async () => {
    if (!productAuction?.id) {
      return;
    }
    await deleteProductAuction(productAuction.id)
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

  if (isFetching || !productAuction) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-full bg-white p-4">
      <div className="pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => {
                  navigate('/auctions');
                }}
              >
                Auctions
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {productAuction.product.name} by {productAuction.product.facilityDetails.user?.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-10">
        <h2 className="mb-9 text-3xl font-bold">Auction details ({auctionId})</h2>
        <div className="grid h-full w-full flex-col gap-4 md:grid-cols-[1fr_2fr_1fr] md:flex-row">
          <div className="w-[500px]">
            <ImageCarousel items={productAuction.photos.map((photo) => ({ preview: photo.signedUrl }))} />
          </div>
          <div className="justify-left flex w-full flex-col gap-4">
            <p>
              Product type: <span className="font-medium">{productAuction.product.productType.name}</span>
            </p>
            <p>
              Auction status:{' '}
              <span
                className={cn(
                  'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                  productAuctionStatus[productAuction.auctionStatus]
                )}
              >
                {ProductAuctionStatusText[productAuction.auctionStatus]}
              </span>
            </p>
            <p>
              Start date:{' '}
              <span className="font-medium">{format(parseISO(productAuction.startDate), 'yyyy-MM-dd')}</span>
            </p>
            <p>
              End date: <span className="font-medium">{format(parseISO(productAuction.endDate), 'yyyy-MM-dd')}</span>
            </p>
            <p>
              Farm name: <span className="font-medium">{productAuction.product.facilityDetails.name}</span>
            </p>
            <p>
              Farm address: <span className="font-medium">{productAuction.product.facilityDetails.address}</span>
            </p>
            <p>
              Owner name: <span className="font-medium">{productAuction.product.facilityDetails.user?.name}</span>
            </p>
          </div>
          <div className="flex w-60 flex-col items-center bg-gray-50 px-2 py-4">
            <p>Don&apos;t waste time!</p>
            <div className="pb-4 pt-2">
              <p className="text-center">Ends in:</p>
              <Timer className="pt-3" toDate={productAuction.endDate} />
              <div className="pt-2">
                <Progress className="h-2 bg-gray-200" value={33} />
                <p className="pt-1">from: {format(parseISO(productAuction.startDate), 'dd.MM.yyyy hh:mm')}</p>
              </div>
            </div>
            <div>
              <p>Current price:</p>
              <h2 className="mb-6 text-center text-3xl font-bold">
                {productAuction.currentMaxBid ? `${productAuction.currentMaxBid?.price} USD` : 'No bets'}
              </h2>
            </div>
            <div className="flex w-3/4 flex-col gap-y-3">
              {user?.role === UserRole.Businessman && (
                <>
                  <Button onClick={() => {}} className="w-full border border-primary text-primary" variant="outline">
                    Place a bet (add number input)
                  </Button>
                  <Button className="w-full">Buy now for {productAuction.buyoutPrice} USD</Button>
                </>
              )}
              {user?.id === productAuction.product.facilityDetails.user?.id && user?.role === UserRole.Farmer && (
                <>
                  <Button
                    type="button"
                    className="w-full"
                    disabled={
                      !(
                        [ProductAuctionStatus.Inactive, ProductAuctionStatus.StartSoon] as ProductAuctionStatusValues[]
                      ).includes(productAuction.auctionStatus)
                    }
                    onClick={() =>
                      navigate(generatePath(AppRoute.Farmer.UpdateAuction, { auctionId: productAuction.id }))
                    }
                  >
                    Update
                  </Button>
                  <Button
                    disabled={
                      !(
                        [ProductAuctionStatus.Inactive, ProductAuctionStatus.StartSoon] as ProductAuctionStatusValues[]
                      ).includes(productAuction.auctionStatus)
                    }
                    type="button"
                    className="w-full"
                    variant="destructive"
                    onClick={handleDeleteClick}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <p>Information about product:</p>
          <p className="mt-8">{productAuction.description}</p>
        </div>
      </div>
      <DeleteModal
        handleOpenChange={handleDeleteModalOpenChange}
        open={isDeleteModalOpen}
        name={deleteModalConfirmName}
        entityTitle={EntityTitle.ProductAuction}
        deleteCallback={handleDeleteProductAuction}
      />
    </div>
  );
}

// className="h-80 w-80 rounded-lg  object-cover min-[1068px]:h-full"
