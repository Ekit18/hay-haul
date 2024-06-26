import { TagInput } from '@/components/tag-input/TagInput';
import { useFormContext } from 'react-hook-form';
import { DeliveriesFilterFormValues } from './validation';
import { deliveryStatusToReadableMap } from '../cards/DeliveryCardStatus.enum';
import { DeliveryStatus } from '@/lib/types/Delivery/Delivery.type';
import { DeliveriesSortSelect } from './DeliveriesSortSelect';
import { FilterSelect } from '@/components/ui/filter-select';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { useAppSelector } from '@/lib/hooks/redux';
import { useMemo } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { Transport } from '@/lib/types/Transport/Transport.type';
import { UserRole } from '@/lib/enums/user-role.enum';

export function DeliveriesFilterForm() {
  const { control } = useFormContext<DeliveriesFilterFormValues>();

  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const carrierTransportsSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams();
    return searchParams;
  }, []);

  const carrierDriversSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams();
    return searchParams;
  }, []);

  const { data: drivers } = driverApi.useGetAllDriversByCarrierIdQuery(
    user ? { carrierId: user.id, searchParams: carrierTransportsSearchParams } : skipToken
  );

  const { data: carrierTransports } = transportApi.useGetAllCarrierTransportsQuery(
    user.role === UserRole.Carrier ? { carrierId: user.id, searchParams: carrierTransportsSearchParams } : skipToken
  );

  const { data: driverTransports } = transportApi.useGetTransportsByDriverIdQuery(
    user.role === UserRole.Driver ? user.id : skipToken
  );

  const transports: Transport[] = carrierTransports ?? driverTransports ?? [];

  return (
    <>
      <div className="mt-10 grid flex-col gap-4 md:grid-cols-3 md:flex-row">
        {user?.role === UserRole.Carrier && (
          <FilterSelect<DeliveriesFilterFormValues, Driver[]>
            title="Driver"
            placeholder="Select a driver"
            values={drivers?.data ?? []}
            labelProperty="user.fullName"
            valueProperty="id"
            fieldName="driverId"
            containerClassName=" flex gap-4 flex-col md:flex-row w-full"
          />
        )}

        <FilterSelect<DeliveriesFilterFormValues, Transport[]>
          title="Transport"
          placeholder="Select a transport"
          values={transports}
          valueProperty="id"
          labelProperty="licensePlate"
          fieldName="transportId"
          containerClassName=" flex gap-4 flex-col md:flex-row w-full"
        />
        <TagInput
          labelText="Select statuses"
          control={control}
          noOptionsText="No matching deliveries"
          name="deliveriesStatus"
          suggestions={Object.entries(DeliveryStatus).map(([key, value]) => ({
            label: deliveryStatusToReadableMap[value],
            value: key
          }))}
          selectedFn={(item: string) => ({
            label: deliveryStatusToReadableMap[DeliveryStatus[item as keyof typeof DeliveryStatus]],
            value: item
          })}
        />
      </div>
    </>
  );
}
