import { ImageCarousel } from '@/components/carousel/ImageCarousel';
import { ConfirmModal } from '@/components/confirm-modal/ConfirmModal';
import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { productAuctionStatus } from '@/components/product-auction/product-auction-card/ProductAuctionStatus.enum';
import { SetBidForm } from '@/components/product-auction/set-bid-form/SetBidForm';
import { SetBidFormValues } from '@/components/product-auction/set-bid-form/validation';
import { TimeProgress } from '@/components/time-progress/TimeProgress';
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
import { productBidApi } from '@/store/reducers/product-auction-bid/productAuctionBidApi';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { format, parseISO } from 'date-fns';
import { Crown, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, generatePath, useNavigate, useParams } from 'react-router-dom';

export function AuctionDetailsPage() {
  const user = useAppSelector((state) => state.user.user);

  const { auctionId } = useParams();
  const navigate = useNavigate();

  const [getProductAuction, { data: productAuctionWithCount, isFetching, isError, isLoading }] =
    productAuctionApi.useLazyGetProductAuctionQuery();

  const productAuction = productAuctionWithCount?.data[0];

  useEffect(() => {
    if (!auctionId) {
      return;
    }
    getProductAuction(auctionId);
  }, [auctionId]);

  const [deleteProductAuction] = productAuctionApi.useDeleteProductAuctionMutation();

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

  const [isBuyoutConfirmModalOpen, setIsBuyoutConfirmModalOpen] = useState<boolean>(false);
  const handleBuyoutConfirmModalOpenChange = useCallback((open: boolean) => setIsBuyoutConfirmModalOpen(open), []);
  const handleBuyoutClick = () => {
    setIsBuyoutConfirmModalOpen(true);
  };

  const [sendBid] = productBidApi.useSetBidMutation();

  const handleBuyoutBid = async () => {
    if (!productAuction) {
      return;
    }

    await sendBid({ auctionId: productAuction.id, price: productAuction.buyoutPrice } as SetBidFormValues)
      .unwrap()
      .finally(() => {
        setIsBuyoutConfirmModalOpen(false);
      })
      .catch(handleRtkError);
    navigate(AppRoute.Businessman.ProductAuctionPaymentPage);
  };

  const handleClickPay = () => {
    if (!productAuction) {
      return;
    }
    navigate(generatePath(AppRoute.Businessman.ProductAuctionPaymentPage, { auctionId: productAuction.id }));
  };

  if (!auctionId || isError) {
    return <Navigate to={generatePath(AppRoute.General.Auctions)} />;
  }
  if (isFetching || isLoading || !productAuction) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  const isBidButtonsDisabled = !(
    [ProductAuctionStatus.Active, ProductAuctionStatus.EndSoon] as ProductAuctionStatusValues[]
  ).includes(productAuction.auctionStatus);

  const isAuctionWinner = productAuction.currentMaxBid?.userId === user?.id;

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
                {productAuction.product.name} by {productAuction.product.facilityDetails.user?.fullName}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="pt-10">
        <h2 className="mb-9 text-3xl font-bold">Auction details ({auctionId})</h2>
        <div className="flex h-full w-full flex-col items-center gap-4 xl:grid xl:grid-cols-[1fr_2fr_1fr] xl:flex-row">
          <div className="w-[500px]">
            <ImageCarousel items={productAuction.photos.map((photo) => ({ preview: photo.signedUrl }))} />
          </div>
          <div className=" xl:justify-left flex w-full flex-col items-center justify-center gap-4 xl:items-start">
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
              Owner name: <span className="font-medium">{productAuction.product.facilityDetails.user?.fullName}</span>
            </p>
            <p>
              Bid step: <span className="font-medium">{productAuction.bidStep} USD</span>
            </p>
          </div>
          <div className="flex h-fit w-60 flex-col items-center rounded-lg bg-gray-100 px-2 py-4">
            <p>Don&apos;t waste time!</p>
            <div className="pb-4 pt-2">
              {(productAuction.auctionStatus === ProductAuctionStatus.Active ||
                productAuction.auctionStatus === ProductAuctionStatus.EndSoon) && (
                <>
                  <p className="text-center">Ends in:</p>
                  <Timer toDate={productAuction.endDate} />
                </>
              )}
              {productAuction.auctionStatus === ProductAuctionStatus.StartSoon && (
                <>
                  <p className="text-center">Starts in:</p>
                  <Timer toDate={productAuction.startDate} className="text-blue-600" />
                </>
              )}
              <div className="pt-2">
                {([ProductAuctionStatus.Active, ProductAuctionStatus.EndSoon] as ProductAuctionStatusValues[]).includes(
                  productAuction.auctionStatus
                ) && (
                  <TimeProgress
                    startDate={new Date(productAuction.startDate)}
                    endDate={new Date(productAuction.endDate)}
                  />
                )}

                <p className="pt-1">from: {format(parseISO(productAuction.startDate), 'dd.MM.yyyy hh:mm')}</p>
              </div>
            </div>
            <div className="">
              <p className="text-center">Current price:</p>
              <div className="mb-6 flex flex-col items-center gap-2">
                <h2 className=" text-center text-3xl font-bold">
                  {productAuction.currentMaxBid ? `${productAuction.currentMaxBid?.price} USD` : 'No bets'}
                </h2>
                {productAuction.currentMaxBid?.userId === user?.id && (
                  <p className="flex gap-2">
                    (YOU) <Crown className="text-yellow-400" />
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-3/4 flex-col gap-y-3">
              {user?.role === UserRole.Businessman ? (
                isAuctionWinner && productAuction.auctionStatus === ProductAuctionStatus.WaitingPayment ? (
                  <Button
                    onClick={handleClickPay}
                    type="button"
                    className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                  >
                    Pay for the product
                  </Button>
                ) : (
                  <>
                    <SetBidForm
                      isDisabled={isBidButtonsDisabled}
                      auctionId={auctionId}
                      currentMaxBid={productAuction.currentMaxBid?.price}
                      startPrice={productAuction.startPrice}
                      bidStep={productAuction.bidStep}
                    />

                    <Button
                      type="button"
                      disabled={isBidButtonsDisabled}
                      onClick={handleBuyoutClick}
                      className="w-full"
                    >
                      Buy now for {productAuction.buyoutPrice}$
                    </Button>
                  </>
                )
              ) : null}
              {user?.role === UserRole.Farmer && user?.id === productAuction.product.facilityDetails.user?.id && (
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
      <ConfirmModal
        confirmCallback={handleBuyoutBid}
        handleOpenChange={handleBuyoutConfirmModalOpenChange}
        open={isBuyoutConfirmModalOpen}
        message={
          <p>
            Are you sure you want to buy this product for{' '}
            <span className="font-bold">{productAuction.buyoutPrice} $</span>?
          </p>
        }
      />
    </div>
  );
}
