import { NumberInputWithRange } from '@/components/ui/number-input-with-range';
import { useFormContext } from 'react-hook-form';
import { DeliveryOrderFilterFormValues } from './validation';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DeliveryOrderStatus, DeliveryOrderStatusDict } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { TagInput } from '@/components/tag-input/TagInput';
import { FilterSelect } from '@/components/ui/filter-select';
import { useAppSelector } from '@/lib/hooks/redux';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { UserRole } from '@/lib/enums/user-role.enum';
import { useMemo } from 'react';
import { FormLabel } from '@/components/ui/form';
import { DeliveryOrderSortSelect } from './DeliveryOrderSortSelect';
import { deliveryOrderStatusToReadableMap } from './libs/delivery-order-status-to-readable.map';
import { useLocation } from 'react-router-dom';
import { AppRoute } from '@/lib/constants/routes';
import { ProductType } from '@/lib/types/ProductType/ProductType.type';
import { EmptyTagInput } from '@/components/tag-input/EmptyTagInput';
import { getLocationsSearchParam } from './libs/getLocationsSearchParam.helper';

export function DeliveryOrderFilterForm() {
  const location = useLocation();
  const { control } = useFormContext<DeliveryOrderFilterFormValues>();

  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const userId = user.id;
  const userRole = user.role;

  const isUserCarrierAndOnAllDeliveryOrdersPage =
    userRole === UserRole.Carrier && location.pathname === AppRoute.Carrier.DeliveryOrders;

  const locationsSearchParams = useMemo(
    () => new URLSearchParams(getLocationsSearchParam(userRole, location.pathname, userId)),
    [userId, userRole]
  );

  const { data: locations } = deliveryOrderApi.useGetAllFarmAndDepotLocationsQuery(locationsSearchParams);

  const fromFarmLocations = useMemo(() => [...new Set(locations?.fromFarmLocations)], [locations]);

  const toDepotLocations = useMemo(() => [...new Set(locations?.toDepotLocations)], [locations]);

  return (
    <>
      <div className="mt-10 grid flex-col gap-4 md:grid-cols-3 md:flex-row">
        <NumberInputWithRange<DeliveryOrderFilterFormValues, 'desiredPrice'>
          fieldName="desiredPrice"
          title="Desired Price"
          key="desiredPrice"
        />

        <div className="flex w-full flex-col justify-end">
          <FormLabel className="mb-3 block">Desired date</FormLabel>
          <DatePickerWithRange<DeliveryOrderFilterFormValues, 'desiredDate'>
            field="desiredDate"
            className="!rounded-l-md !border-l"
          />
        </div>
        {isUserCarrierAndOnAllDeliveryOrdersPage ? (
          <EmptyTagInput selected={[{ name: DeliveryOrderStatus.Active } as ProductType]} />
        ) : (
          <TagInput
            labelText="Select statuses"
            control={control}
            noOptionsText="No matching orders"
            name="deliveryOrderStatus"
            suggestions={Object.entries(DeliveryOrderStatus).map(([key, value]) => ({
              label: deliveryOrderStatusToReadableMap[value],
              value: key
            }))}
            selectedFn={(item: string) => ({
              label: (DeliveryOrderStatus as DeliveryOrderStatusDict)[item],
              value: item
            })}
          />
        )}
        <FilterSelect<DeliveryOrderFilterFormValues, string[]>
          title="From farm"
          placeholder="Select a farm"
          values={fromFarmLocations}
          fieldName="fromFarmLocation"
          containerClassName=" flex gap-4 flex-col md:flex-row w-full"
        />
        <FilterSelect<DeliveryOrderFilterFormValues, string[]>
          title="To depot"
          placeholder="Select a depot"
          values={toDepotLocations}
          fieldName="toDepotLocation"
          containerClassName=" flex gap-4 flex-col md:flex-row w-full"
        />

        <DeliveryOrderSortSelect containerClassName="lg:ml-0" />
      </div>
    </>
  );
}
