import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { FilterSelect } from '@/components/ui/filter-select';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdateDeliveryFormValues, useUpdateDeliveryFormSchema } from './validation';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { Transport } from '@/lib/types/Transport/Transport.type';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { deliveryApi } from '@/store/reducers/delivery/deliveryApi';
import { Delivery } from '@/lib/types/Delivery/Delivery.type';

interface UpdateDeliveryModalProps {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  delivery: Delivery;
}

export function UpdateDeliveryModal({ open, handleOpenChange, delivery }: UpdateDeliveryModalProps) {
  const user = useAppSelector((state) => state.user.user);
  const [updateDelivery] = deliveryApi.useUpdateDeliveryMutation();

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

  const updateDeliverySchema = useUpdateDeliveryFormSchema();

  const form = useForm<UpdateDeliveryFormValues>({
    mode: 'onBlur',
    defaultValues: {
      driverId: delivery.driver.id,
      transportId: delivery.transport.id
    },
    resolver: yupResolver(updateDeliverySchema)
  });

  const onSubmit: SubmitHandler<UpdateDeliveryFormValues> = async (data) => {
    console.log(data);
    await updateDelivery({ id: delivery.id, body: data })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Delivery updated',
          description: 'Delivery has been updated successfully.'
        });
        form.reset();
      })
      .finally(() => handleOpenChange(false))
      .catch(handleRtkError);
  };

  const driver = form.watch('driverId');
  console.log(driver);
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new delivery</DialogTitle>
          <DialogDescription>Add your new delivery here.</DialogDescription>
        </DialogHeader>
        {areDriversLoading || areDriversFetching || areTransportsLoading || areTransportsFetching ? (
          <div className="flex w-full justify-center">
            <Loader2 className="h-10 w-10 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <div className="flex w-full flex-col items-center justify-center gap-10">
              <div className="flex w-full flex-col gap-4 py-4">
                <div className="w-full items-center ">
                  <FilterSelect<UpdateDeliveryFormValues, Driver[]>
                    fieldName="driverId"
                    title="Driver"
                    labelProperty="user.fullName"
                    values={[...(drivers?.data ?? []), delivery.driver]}
                    placeholder="Select a driver"
                    valueProperty="id"
                    containerClassName="w-full items-center"
                  />
                </div>
                <div className="w-full items-center ">
                  <FilterSelect<UpdateDeliveryFormValues, Transport[]>
                    fieldName="transportId"
                    title="Transport"
                    values={transports ?? []}
                    placeholder="Select a transport"
                    valueProperty="id"
                    labelProperty="licensePlate"
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
                  Update
                </Button>
              </DialogFooter>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
