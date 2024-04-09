import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppSelector } from '@/lib/hooks/redux';
import { DeliveryOrder, DeliveryOrderStatusText } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { cn } from '@/lib/utils';
import { MapPin, Trash2 } from 'lucide-react';
import { deliveryOrderStatus } from './DeliveryOrderCardStatus.enum';

export type DeliveryOrderCardProps = {
  deliveryOrder: DeliveryOrder;
};

export function DeliveryOrderCard({ deliveryOrder }: DeliveryOrderCardProps) {
  const user = useAppSelector((state) => state.user.user);

  return (
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
        <div className="pt-2">
          <div className="flex items-end gap-2">
            <MapPin size={20} className="min-h-5 min-w-5" />
            {deliveryOrder.productAuction?.product.facilityDetails?.address}
          </div>
          <div className="ml-[9px] h-5 border-l-2 border-dashed border-primary"></div>
          <div className="flex gap-2">
            <MapPin size={20} className="min-h-5 min-w-5" />
            {deliveryOrder.facilityDetails?.address}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="destructive" className="gap-2">
          <Trash2 size={20} /> Delete
        </Button>
        <Button type="button">Update</Button>
      </CardFooter>
    </Card>
  );
}
