import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  DeliveryOffer,
  DeliveryOfferStatus,
  deliveryOfferStatusText
} from '@/lib/types/DeliveryOffer/DeliveryOffer.type';
import { deliveryOfferStatus } from './DeliveryOfferStatus.enum';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/lib/hooks/redux.ts';
import { deliveryOfferApi } from '@/store/reducers/delivery-offer/deliveryOfferApi';
import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { useCallback, useState } from 'react';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { toast } from '@/components/ui/use-toast';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { UserRole } from '@/lib/enums/user-role.enum';

interface DeliveryOfferCardProps {
  deliveryOffer: DeliveryOffer;
}

export function DeliveryOfferCard({ deliveryOffer }: DeliveryOfferCardProps) {
  console.log(deliveryOffer.offerStatus);
  const user = useAppSelector((state) => state.user.user);
  console.log(deliveryOfferStatus.Pending);
  console.log('\\\\\\\\\\\\\\');

  const [open, setOpen] = useState(false);

  const [deleteDeliveryOffer] = deliveryOfferApi.useDeleteDeliveryOfferMutation();

  const handleDeleteModalOpenChange = useCallback((open: boolean) => setOpen(open), []);

  const handleDeleteDeliveryOffer = async () => {
    await deleteDeliveryOffer(deliveryOffer.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Delivery offer deleted',
          description: 'Your delivery has been deleted successfully.'
        });
      })
      .finally(() => setOpen(false))
      .catch(handleRtkError);
  };

  const [acceptOffer] = deliveryOfferApi.useAcceptDeliveryOfferByIdMutation();

  const [declineOffer] = deliveryOfferApi.useDeclineDeliveryOfferByIdMutation();

  const handleAcceptDeliveryOffer = async () => {
    if (user?.role !== UserRole.Businessman) {
      return;
    }
    acceptOffer(deliveryOffer.id);
  };

  const handleDeclineDeliveryOffer = async () => {
    if (user?.role !== UserRole.Businessman) {
      return;
    }
    declineOffer(deliveryOffer.id);
  };

  return (
    <>
      <Card className="flex w-full flex-col justify-between">
        <CardHeader>
          <CardTitle>From {deliveryOffer.user.facilityDetails[0].name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Status:{' '}
            <span
              className={cn(
                'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                deliveryOfferStatus[deliveryOffer.offerStatus]
              )}
            >
              {deliveryOfferStatusText[deliveryOffer.offerStatus]}
            </span>
          </p>

          <p className="pt-2">
            Offered price:{' '}
            <span className="w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm">{deliveryOffer.price} USD</span>
          </p>
          <p>
            Company address:{' '}
            <span className="w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm">
              {deliveryOffer.user.facilityDetails[0].address}
            </span>
          </p>
        </CardContent>
        <CardFooter className="flex w-full flex-col items-center justify-center gap-5">
          {deliveryOffer.offerStatus === DeliveryOfferStatus.Pending && deliveryOffer.userId === user?.id && (
            <Button
              variant="destructive"
              className="w-full"
              type="button"
              onClick={() => handleDeleteModalOpenChange(true)}
            >
              Delete
            </Button>
          )}
          {deliveryOffer.offerStatus === DeliveryOfferStatus.Pending && user?.role === UserRole.Businessman && (
            <div className="flex w-full flex-row justify-center gap-2">
              <Button variant="destructive" type="button" onClick={handleDeclineDeliveryOffer}>
                Decline
              </Button>
              <Button type="button" onClick={handleAcceptDeliveryOffer}>
                Accept
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      <DeleteModal
        entityTitle={EntityTitle.DeliveryOffer}
        handleOpenChange={handleDeleteModalOpenChange}
        deleteCallback={handleDeleteDeliveryOffer}
        open={open}
        name={deliveryOffer.user.facilityDetails[0].name}
      />
    </>
  );
}
