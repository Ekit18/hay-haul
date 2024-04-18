import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { deliveryOfferApi } from '@/store/reducers/delivery-offer/deliveryOfferApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateDeliveryOfferValues, useCreateDeliveryOfferFormSchema } from './validation';

interface CreateDeliveryOfferModalProps {
  deliveryOrderId: string;
  desiredPrice: number;
}

export function CreateDeliveryOfferModal({ deliveryOrderId, desiredPrice }: CreateDeliveryOfferModalProps) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  const [createDeliveryOffer] = deliveryOfferApi.useCreateDeliveryOfferMutation();

  const onSubmit: SubmitHandler<CreateDeliveryOfferValues> = async (data) => {
    await createDeliveryOffer(data)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Delivery offer created',
          description: 'Delivery offer has been created successfully.'
        });
      })
      .finally(() => handleOpenChange(false))
      .catch(handleRtkError);
  };

  const createDeliveryOfferSchema = useCreateDeliveryOfferFormSchema();

  const form = useForm<CreateDeliveryOfferValues>({
    mode: 'onChange',
    resolver: yupResolver(createDeliveryOfferSchema),
    defaultValues: {
      deliveryOrderId,
      price: desiredPrice
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => setOpen(true)}>
          Make an offer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new delivery offer</DialogTitle>
          <DialogDescription>Add your delivery offer here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name={'price'}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">Choose price for delivery</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Price"
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              field.onChange(undefined);
                              return;
                            }
                          }}
                          onChange={(e) => {
                            if (Number.isNaN(e.target.valueAsNumber)) {
                              field.onChange(undefined);
                              return;
                            }

                            if (e.target.valueAsNumber <= 0) {
                              return;
                            }

                            field.onChange(e.target.valueAsNumber);
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
                Submit
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}