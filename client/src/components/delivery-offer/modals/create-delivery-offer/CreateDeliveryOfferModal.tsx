import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { deliveryOfferApi } from '@/store/reducers/delivery-offer/deliveryOfferApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateDeliveryOfferValues, useCreateDeliveryOfferFormSchema } from './validation';
import { deliveryOfferPriceRatios } from './constants';

interface CreateDeliveryOfferFormProps {
  deliveryOrderId: string;
  desiredPrice: number;
  currentPrice?: number;
}

export function CreateDeliveryOfferForm({ deliveryOrderId, desiredPrice, currentPrice }: CreateDeliveryOfferFormProps) {
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
      price: currentPrice || desiredPrice
    }
  });

  const price = form.watch('price');

  const handleSetPriceRation = (ration: number) => {
    form.setValue('price', Math.round(price + price * ration));
  };

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <div className="flex w-full flex-col gap-4 py-4">
          <div className="w-full items-center ">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="block text-center">Choose price</FormLabel>
                  <div className="flex flex-row items-center justify-center gap-1">
                    {deliveryOfferPriceRatios.map((ratio) => (
                      <Button
                        type="button"
                        key={ratio.label}
                        className="h-5 w-10 text-xs"
                        onClick={() => handleSetPriceRation(ratio.value)}
                      >
                        +{ratio.label}
                      </Button>
                    ))}
                  </div>
                  <FormControl>
                    <Input
                      className="w-full"
                      placeholder="Price"
                      {...field}
                      onBlur={(e) => {
                        if (e.target.value === '') {
                          field.onChange(undefined);
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
        <Button type="button" onClick={form.handleSubmit(onSubmit)} className="w-full px-10">
          Submit
        </Button>
      </div>
    </Form>
  );
}
