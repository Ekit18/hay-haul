import { deliveryCardStatus, deliveryStatusToReadableMap } from '@/components/deliveries/cards/DeliveryCardStatus.enum';
import { driverCardStatus } from '@/components/drivers/card/DriverCardStatus.enum';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { AppRoute } from '@/lib/constants/routes';
import { UserRole } from '@/lib/enums/user-role.enum';
import { DeliveryOrderDestination } from '@/components/delivery-order/card/DeliveryOrderDestination';
import { cn } from '@/lib/utils';
import { deliveryApi } from '@/store/reducers/delivery/deliveryApi';
import { Loader2, Package } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { transportTypeToIcon, transportTypeToReadable } from '@/components/transport/transport-card/constants';
import { Timeline } from '@/components/timeline/Timeline';
import { GMapPreview } from '@/components/delivery-details/GmapPreview';
import { DeliveryStatus, DeliveryStatusValues } from '@/lib/types/Delivery/Delivery.type';
import { Button, ButtonProps } from '@/components/ui/button';
import { PropsWithChildren, useState } from 'react';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { ConfirmModal } from '@/components/confirm-modal/ConfirmModal';
import { DeliveryOrderStatus } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { toast } from '@/components/ui/use-toast';

export function DeliveryDetails() {
  const navigate = useNavigate();

  const { deliveryId } = useParams();

  const { data: delivery, isFetching, isLoading } = deliveryApi.useGetDeliveryByIdQuery(deliveryId as string);

  const [update] = deliveryApi.useUpdateDeliveryByDriverMutation();

  const [open, setOpen] = useState(false);

  const handleOpenChange = () => {
    setOpen(!open);
  };

  const handleUpdateDeliveryClick = (id: string) => () => {
    update({ id })
      .unwrap()
      .then(() => {
        setOpen(false);
        toast({
          variant: 'success',
          title: 'Delivery updated',
          description: 'Delivery has been updated successfully.'
        });
      })
      .catch(handleRtkError);
  };

  if (isFetching || isLoading || !delivery) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  const transportIcon = transportTypeToIcon[delivery.transport.type];
  const transportLabel = transportTypeToReadable[delivery.transport.type];

  return (
    <div className="h-full bg-white p-4">
      <div className="pt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="cursor-pointer"
                onClick={() => {
                  navigate(AppRoute.Driver.Deliveries);
                }}
              >
                Deliveries
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {delivery.deliveryOrder.productAuction.product.name} to {delivery.deliveryOrder.facilityDetails.address}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h2 className="mb-9 pt-10 text-3xl font-bold">Delivery details ({delivery.id})</h2>
      <div className="flex w-full  flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col items-start gap-2">
          <div>
            <h3 className="text-lg font-bold">Driver info</h3>
            Driver: <span>{delivery.driver.user.fullName}</span> |{' '}
            <span
              className={cn(
                'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                driverCardStatus[delivery.driver.status]
              )}
            >
              {delivery.driver.status}
            </span>{' '}
            {delivery.driver.yearsOfExperience} years of experience
          </div>
          <div>
            <h3 className="text-lg font-bold">Transport info</h3>
            Transport: <span>{delivery.transport.name}</span> | {delivery.transport.licensePlate}{' '}
            <div className="flex items-center gap-2">
              <p>Type: </p>
              <p className="flex items-center gap-1 rounded-md border border-black p-1 text-sm">
                <transportIcon.icon size={16} />
                {transportLabel}
              </p>
            </div>
          </div>
          <div className="mt-2 flex flex-col items-start gap-1">
            <h3 className="text-lg font-bold">Product info</h3>
            <div className="flex flex-row items-center justify-start gap-1">
              <p>Product type:</p>
              <div className=" flex w-min flex-row gap-2 rounded border border-black p-1">
                <Package className="min-h-5 min-w-5" />
                <span>{delivery.deliveryOrder.productAuction.product.productType.name}</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-start gap-1">
              <p>Product name:</p>
              <span>{delivery.deliveryOrder.productAuction.product.name}</span>
            </div>
            <p>Weight: {delivery.deliveryOrder.productAuction.product.quantity} tones</p>
          </div>
          <DeliveryOrderDestination
            from={delivery.deliveryOrder.productAuction?.product.facilityDetails?.address}
            to={delivery.deliveryOrder.facilityDetails?.address}
          />
        </div>
        <div className="mt-4">
          <GMapPreview
            fromAddress={delivery.deliveryOrder.productAuction?.product.facilityDetails?.address}
            toAddress={delivery.deliveryOrder.facilityDetails?.address}
          />
          {delivery.deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.Delivered &&
            statusToButtonMap({ status: delivery.status, handleClick: handleOpenChange })}
        </div>
      </div>
      <div className="w-full pt-10">
        <h3 className="text-lg font-bold">Delivery progress:</h3>
        <Timeline deliveryStatus={delivery.status} />
      </div>
      <ConfirmModal
        open={open}
        handleOpenChange={handleOpenChange}
        confirmCallback={handleUpdateDeliveryClick(delivery.id)}
        message="Are you sure that you want to change status?"
      />
    </div>
  );
}

export function DeliveryButton({
  children,
  className,
  ...props
}: PropsWithChildren<ButtonProps & React.RefAttributes<HTMLButtonElement>>) {
  return (
    <Button type="button" className={cn('mt-12 w-full', className)} {...props}>
      {children}
    </Button>
  );
}

export const statusToButtonMap = ({
  status,
  handleClick
}: {
  handleClick: () => void;
  status: DeliveryStatusValues;
}) => {
  const statusToTextMap = {
    ['null']: 'Accept delivery',
    [DeliveryStatus.AwaitingDriver]: 'Arrived to farm',
    [DeliveryStatus.AtFarmerFacility]: 'Started loading',
    [DeliveryStatus.Loading]: 'Loaded',
    [DeliveryStatus.OnTheWay]: 'Arrived to warehouse',
    [DeliveryStatus.AtBusinessFacility]: 'Started unloading',
    [DeliveryStatus.Unloading]: 'Finish delivery'
  };

  const statusValue = String(status) as `${`${null}` | DeliveryStatusValues}`;

  return (
    <DeliveryButton onClick={handleClick} className={deliveryCardStatus[statusValue]}>
      {statusToTextMap[statusValue]}
    </DeliveryButton>
  );
};
