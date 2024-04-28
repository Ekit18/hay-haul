import { driverCardStatus } from '@/components/drivers/card/DriverCardStatus.enum';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { deliveryCardStatus, deliveryStatusToReadableMap } from './DeliveryCardStatus.enum';
import { Delivery } from '@/lib/types/Delivery/Delivery.type';
import { format } from 'date-fns';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useAppSelector } from '@/lib/hooks/redux';
import { generatePath, useNavigate } from 'react-router-dom';
import { AppRoute } from '@/lib/constants/routes';

interface DeliveryCardProps {
  delivery: Delivery;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function DeliveryCard({ delivery, onDeleteClick, onEditClick }: DeliveryCardProps) {
  const user = useAppSelector((state) => state.user.user);

  const navigate = useNavigate();

  return (
    <Card className="flex w-full flex-col justify-between">
      <CardHeader>
        <CardTitle>
          {delivery.deliveryOrder.productAuction.product.name} from{' '}
          {delivery.deliveryOrder.productAuction.product.facilityDetails.name}
        </CardTitle>
        <CardDescription>Last update: {format(new Date(delivery.updatedAt), 'dd-MM-yyyy HH:mm:ss')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-start gap-2">
          <p>
            Status:{' '}
            <span
              className={cn(
                'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                deliveryCardStatus[delivery.status ?? 'null']
              )}
            >
              {deliveryStatusToReadableMap[delivery.status ?? 'null']}
            </span>
          </p>
          <p>
            Driver: <span>{delivery.driver.user.fullName}</span> |{' '}
            <span
              className={cn(
                'w-max whitespace-nowrap rounded-lg px-2 py-1 text-sm',
                driverCardStatus[delivery.driver.status]
              )}
            >
              {delivery.driver.status}
            </span>
          </p>
          <p>
            Transport: <span>{delivery.transport.name}</span> | {delivery.transport.licensePlate}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2">
        {delivery.status === null && (
          <>
            {user?.role === UserRole.Carrier && (
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <Button onClick={onDeleteClick} type="button" variant="destructive" className="gap-2">
                  <Trash2 size={20} /> Delete
                </Button>
                <Button onClick={onEditClick} type="button">
                  Update
                </Button>
              </div>
            )}
          </>
        )}
        {user?.role === UserRole.Driver && (
          <Button
            className="w-full"
            type="button"
            onClick={() => navigate(generatePath(AppRoute.Driver.DeliveryDetails, { deliveryId: delivery.id }))}
          >
            Learn more
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
