import { ConfirmModal } from '@/components/confirm-modal/ConfirmModal';
import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { UserRole } from '@/lib/enums/user-role.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import {
  DeliveryOrder,
  DeliveryOrderStatus,
  DeliveryOrderStatusText
} from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { cn } from '@/lib/utils';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { Package, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { UpdateDeliveryOrderModalHOC } from '../modals/update-delivery-order/UpdateDeliveryOrderModal';
import { deliveryOrderStatus } from './DeliveryOrderCardStatus.enum';
import { DeliveryOrderDestination } from './DeliveryOrderDestination';

export type DeliveryOrderCardProps = {
  deliveryOrder: DeliveryOrder;
};

export function DeliveryOrderCard({ deliveryOrder }: DeliveryOrderCardProps) {
  const navigate = useNavigate();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const user = useAppSelector((state) => state.user.user);
  if (!user) return null;

  const [deleteDeliveryOrder] = deliveryOrderApi.useDeleteDeliveryOrderMutation();

  const [startDeliveryOrder] = deliveryOrderApi.useStartDeliveryOrderMutation();

  const handleDeleteModalOpenChange = (open: boolean) => {
    setIsDeleteModalOpen(open);
  };

  const handleDeleteDeliveryOrder = async () => {
    await deleteDeliveryOrder(deliveryOrder.id).unwrap().catch(handleRtkError);
  };

  const [open, setOpen] = useState(false);

  const handleStartDeliveryOrder = async () => {
    await startDeliveryOrder(deliveryOrder.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Delivery order status was set to active',
          description: 'Delivery order status was set to active successfully'
        });
      })
      .catch(handleRtkError);
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(!open);
  };

  return (
    <>
      <Card className="flex w-full flex-col justify-between">
        <CardHeader>
          <CardTitle>
            {deliveryOrder.productAuction?.product.name} to {deliveryOrder.facilityDetails?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Status:{' '}
            <span
              className={cn(
                'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                deliveryOrderStatus[deliveryOrder.deliveryOrderStatus]
              )}
            >
              {DeliveryOrderStatusText[deliveryOrder.deliveryOrderStatus]}
            </span>
          </p>
          <div className="mt-2 flex flex-row items-center gap-1">
            <p>Product type:</p>
            <div className=" flex w-min flex-row gap-2 rounded border border-black p-1">
              <Package className="min-h-5 min-w-5" />
              <span>{deliveryOrder.productAuction?.product.productType.name}</span>
            </div>
          </div>
          <p className="pt-2 ">Desired delivery price: {deliveryOrder.desiredPrice} USD</p>
          <DeliveryOrderDestination
            from={deliveryOrder.productAuction?.product.facilityDetails?.address}
            to={deliveryOrder.facilityDetails?.address}
          />
          {deliveryOrder.deliveryOrderStatus !== DeliveryOrderStatus.Inactive && (
            <p className="pt-2">Delivery offers: {deliveryOrder.deliveryOffers.length}</p>
          )}
          {/* todo: create counter of offers */}
        </CardContent>
        <CardFooter className="flex w-full flex-col items-center justify-center gap-5">
          {deliveryOrder.deliveryOrderStatus === DeliveryOrderStatus.Inactive &&
            user.role === UserRole.Businessman &&
            user.id === deliveryOrder.userId && (
              <div className="flex w-full flex-col items-center justify-start gap-1 md:flex-row">
                <Button
                  type="button"
                  variant="destructive"
                  className="flex w-full gap-1"
                  onClick={() => handleDeleteModalOpenChange(true)}
                >
                  <Trash2 size={20} className="min-h-5 min-w-5" /> Delete
                </Button>
                <UpdateDeliveryOrderModalHOC deliveryOrder={deliveryOrder} />
                {user.id === deliveryOrder.userId && (
                  <Button type="button" className="w-full" onClick={() => handleOpenChange(open)}>
                    Start
                  </Button>
                )}
              </div>
            )}

          <Button
            className="w-full"
            type="button"
            onClick={() =>
              navigate(generatePath(AppRoute.General.DeliveryOrder, { deliveryOrderId: deliveryOrder.id }))
            }
          >
            Learn more
          </Button>
        </CardFooter>
      </Card>
      <DeleteModal
        entityTitle={EntityTitle.DeliveryOrder}
        deleteCallback={handleDeleteDeliveryOrder}
        name={`${deliveryOrder.productAuction?.product.name} to ${deliveryOrder.facilityDetails?.name}`}
        handleOpenChange={handleDeleteModalOpenChange}
        open={isDeleteModalOpen}
      />
      <ConfirmModal
        open={open}
        handleOpenChange={handleOpenChange}
        confirmCallback={handleStartDeliveryOrder}
        message="Are you sure that you want to set active status?"
      />
    </>
  );
}
