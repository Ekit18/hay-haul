import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { DropdownCalendar } from '@/components/ui/dropdown-calendar';
import { FilterSelect } from '@/components/ui/filter-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { ProductAuction } from '@/lib/types/ProductAuction/ProductAuction.type';
import { cn } from '@/lib/utils';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { addDays, format } from 'date-fns';
import { CalendarIcon, InfoIcon, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateDeliveryFormValues, createDeliveryFormDefaultValues, useCreateDeliveryFormSchema } from './validation';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { Transport } from '@/lib/types/Transport/Transport.type';
import { DeliveryOrder } from '@/lib/types/DeliveryOrder/DeliveryOrder.type';
import { User } from '@/lib/types/User/User.type';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { deliveryApi } from '@/store/reducers/delivery/deliveryApi';

interface CreateDeliveryModalHOCProps {}

export function CreateDeliveryModalHOC({}: CreateDeliveryModalHOCProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)} className="bg-green-700 text-white">
        Create delivery
      </Button>
      {isOpen && <CreateDeliveryModal open={isOpen} handleOpenChange={handleOpenChange} />}
    </>
  );
}

interface CreateDeliveryModalProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

function CreateDeliveryModal({ open, handleOpenChange }: CreateDeliveryModalProps) {
  const user = useAppSelector((state) => state.user.user);
  const [createDelivery] = deliveryApi.useCreateDeliveryMutation();

  const queryDriversSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('isAvailable', true.toString());
    return searchParams;
  }, []);

  const {
    data: drivers,
    isLoading: areDriversLoading,
    isFetching: areDriversFetching
  } = driverApi.useGetAllDriversByCarrierIdQuery(
    user?.id ? { carrierId: user.id, searchParams: queryDriversSearchParams } : skipToken
  );

  const queryTransportsSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('isAvailable', true.toString());
    return searchParams;
  }, []);

  const {
    data: transports,
    isLoading: areTransportsLoading,
    isFetching: areTransportsFetching
  } = transportApi.useGetAllCarrierTransportsQuery(
    user?.id ? { carrierId: user.id, searchParams: queryTransportsSearchParams } : skipToken
  );

  const queryDeliveryOrdersSearchParams = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (!user?.id) {
      return searchParams;
    }
    searchParams.set('chosenCarrierId', user?.id);
    return searchParams;
  }, [user?.id]);

  const {
    data: orders,
    isLoading: areOrdersLoading,
    isFetching: areOrdersFetching
  } = deliveryOrderApi.useGetAllDeliveryOrdersQuery(user?.id ? queryDeliveryOrdersSearchParams : skipToken);

  const createDeliverySchema = useCreateDeliveryFormSchema();

  const [defaultValues, setDefaultValues] = useState<CreateDeliveryFormValues>(createDeliveryFormDefaultValues);

  const form = useForm<CreateDeliveryFormValues>({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(createDeliverySchema)
  });

  const onSubmit: SubmitHandler<CreateDeliveryFormValues> = async (data) => {
    console.log(data);
    await createDelivery(data)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Delivery created',
          description: 'Delivery has been created successfully.'
        });
      })
      .finally(() => handleOpenChange(false))
      .catch(handleRtkError);
  };

  if (
    areDriversLoading ||
    areDriversFetching ||
    areTransportsLoading ||
    areTransportsFetching ||
    areOrdersLoading ||
    areOrdersFetching
  ) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new delivery</DialogTitle>
          <DialogDescription>Add your new delivery here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FilterSelect<CreateDeliveryFormValues, Driver[]>
                  fieldName="driverId"
                  title="Driver"
                  values={drivers?.data ?? []}
                  placeholder="Select a driver"
                  valueProperty="id"
                  containerClassName="w-full items-center"
                />
              </div>
              <div className="w-full items-center ">
                <FilterSelect<CreateDeliveryFormValues, Transport[]>
                  fieldName="transportId"
                  title="Transport"
                  values={transports ?? []}
                  placeholder="Select a transport"
                  valueProperty="id"
                  containerClassName="w-full items-center"
                />
              </div>
              <div className="w-full items-center ">
                <FilterSelect<CreateDeliveryFormValues, DeliveryOrder[]>
                  fieldName="deliveryOrderId"
                  title="Delivery order"
                  values={orders?.data ?? []}
                  placeholder="Select a delivery order"
                  valueProperty="id"
                  containerClassName="w-full items-center"
                />
              </div>
            </div>
            <DialogFooter className="flex w-full justify-end">
              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="px-10"
                // disabled={!paidAuctions?.data.length}
              >
                Create
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
