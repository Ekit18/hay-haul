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
import { deliveryOrderApi } from '@/store/reducers/delivery-order/deliveryOrderApi';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CreateDeliveryOrderValues,
  createDeliveryOrderDefaultValues,
  useCreateDeliveryOrderFormSchema
} from './validation';

interface CreateDeliveryOrderModalHOCProps {
  auctionId?: string;
}

export function CreateDeliveryOrderModalHOC({ auctionId }: CreateDeliveryOrderModalHOCProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-green-700 text-white">
        Create delivery order
      </Button>
      {isOpen && <CreateDeliveryOrderModal auctionId={auctionId} open={isOpen} handleOpenChange={handleOpenChange} />}
    </>
  );
}

interface CreateDeliveryOrderModalProps {
  auctionId?: string;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
}

function CreateDeliveryOrderModal({ auctionId, open, handleOpenChange }: CreateDeliveryOrderModalProps) {
  const user = useAppSelector((state) => state.user.user);
  const [createDeliveryOrder] = deliveryOrderApi.useCreateDeliveryOrderMutation();

  const { data: paidAuctions } = productAuctionApi.useGetPaidProductAuctionsQuery(!auctionId ? '' : skipToken);

  if (!user) {
    return null;
  }

  const userId = user.id;

  const createDeliveryOrderSchema = useCreateDeliveryOrderFormSchema();

  const form = useForm<CreateDeliveryOrderValues>({
    mode: 'onBlur',
    defaultValues: { ...createDeliveryOrderDefaultValues, auctionId },
    resolver: yupResolver(createDeliveryOrderSchema)
  });

  const { data: depots } = facilityDetailsApi.useGetAllByUserIdQuery(userId);

  //   const productTypesByFarmId = farms?.find((farm) => farm.id === farmId)?.productTypes || [];

  const onSubmit: SubmitHandler<CreateDeliveryOrderValues> = async (data) => {
    console.log(data);
    await createDeliveryOrder(data)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Product created',
          description: 'Product has been created successfully.'
        });
      })
      .finally(() => handleOpenChange(false))
      .catch(handleRtkError);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new delivery order</DialogTitle>
          <DialogDescription>Add your new delivery order here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                {!auctionId && (
                  <FilterSelect<CreateDeliveryOrderValues, ProductAuction[]>
                    fieldName="auctionId"
                    title="Product auction"
                    values={paidAuctions?.data as ProductAuction[]}
                    placeholder="Select a product auction"
                    valueProperty="id"
                    containerClassName="w-full items-center"
                  />
                )}
              </div>
              <div className="w-full items-center ">
                <FilterSelect<CreateDeliveryOrderValues, FacilityDetails[]>
                  fieldName="depotId"
                  title="Depot"
                  values={depots}
                  placeholder="Select a depot"
                  valueProperty="name"
                  containerClassName="w-full items-center"
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="desiredDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="block">Choose desired delivery date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? format(field.value, 'PPP') : <span>Pick desired delivery date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DropdownCalendar
                              mode="single"
                              fromDate={addDays(new Date(), 1)}
                              initialFocus
                              selected={field.value}
                              onSelect={field.onChange}
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full items-center">
                <FormField
                  control={form.control}
                  name={'desiredPrice'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Min"
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              field.onChange(e.target.value);
                              return;
                            }
                            field.onChange(e.target.value);
                          }}
                          onChange={(e) => {
                            if (Number.isNaN(e.target.valueAsNumber)) {
                              field.onChange(e.target.value);
                              return;
                            }
                            if (e.target.valueAsNumber <= 0) {
                              return;
                            }
                            field.onChange(e.target.value);
                          }}
                          value={field.value || ''}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex w-full justify-end">
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10">
                Create
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
