import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { productBidApi } from '@/store/reducers/product-auction-bid/productAuctionBidApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { SetBidFormValues, useSetBidFormSchema } from './validation';

interface SetBidFormProps {
  auctionId: string;
  currentMaxBid?: number;
  startPrice: number;
  bidStep: number;
  isDisabled: boolean;
}

export function SetBidForm({ auctionId, currentMaxBid, bidStep, startPrice, isDisabled }: SetBidFormProps) {
  const [sendBid, { isLoading }] = productBidApi.useSetBidMutation();

  const setBidForSchema = useSetBidFormSchema();

  const form = useForm<SetBidFormValues>({
    mode: 'onBlur',
    values: {
      auctionId,
      currentMaxBid: currentMaxBid || 0,
      bidStep,
      price: currentMaxBid ? currentMaxBid + bidStep : startPrice,
      startPrice
    },
    resolver: yupResolver(setBidForSchema)
  });

  const onSubmit: SubmitHandler<SetBidFormValues> = async (values) => {
    await sendBid(values)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Bid was set successfully.',
          description: 'Your bid was successfully set.'
        });
      })
      .catch(handleRtkError);
  };

  return (
    <>
      <Form {...form}>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Enter start price"
                  {...field}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      field.onChange(0);
                    }
                  }}
                  onChange={(e) => {
                    if (Number.isNaN(e.target.valueAsNumber)) {
                      field.onChange(0);
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
        <Button
          disabled={isDisabled}
          type="button"
          onClick={form.handleSubmit(onSubmit)}
          className="w-full border border-primary text-primary"
          variant="outline"
        >
          {isLoading && <Loader2 className="mr-2 animate-spin" size={20} />}
          Place a bet
        </Button>
      </Form>
    </>
  );
}
