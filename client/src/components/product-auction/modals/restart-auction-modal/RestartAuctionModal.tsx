import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { DropdownCalendar } from '@/components/ui/dropdown-calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppDispatch } from '@/lib/hooks/redux';
import { cn } from '@/lib/utils';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { generatePath, useNavigate } from 'react-router-dom';
import { addDaysRatios } from '../../create-product-auction/constants';
import {
  RestartProductAuctionFormValues,
  restartProductAuctionDefaultValues,
  useProductAuctionRestartFormSchema
} from './validation';

export function RestartAuctionModal({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const [restartProductAuction] = productAuctionApi.useRestartProductAuctionMutation();

  const restartProductAuctionFormSchema = useProductAuctionRestartFormSchema();

  const form = useForm<RestartProductAuctionFormValues>({
    mode: 'onBlur',
    defaultValues: restartProductAuctionDefaultValues,
    resolver: yupResolver(restartProductAuctionFormSchema)
  });

  const handleRestartModalOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  const startEndDate = form.watch('startEndDate');
  const paymentPeriod = form.watch('paymentPeriod');

  const handleAddStartEndDays = (days: number) => {
    if (!startEndDate) {
      const startDate = new Date();
      form.setValue('startEndDate', { from: addDays(startDate, days), to: addDays(startDate, days + 1) });
      return;
    }

    if (!startEndDate.to) {
      const endDate = addDays(startEndDate.from, days);
      form.setValue('startEndDate', { from: startEndDate.from, to: endDate });
      return;
    }

    form.setValue('startEndDate', { from: startEndDate.from, to: addDays(startEndDate.to, days) });
  };

  const handleAddPaymentPeriod = (days: number) => {
    form.setValue('paymentPeriod', addDays(paymentPeriod, days));
  };

  const onSubmit: SubmitHandler<RestartProductAuctionFormValues> = async (data) => {
    await restartProductAuction({ body: data, id })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Auction restarted',
          description: 'Your auction has been restarted successfully.'
        });
        navigate(generatePath(AppRoute.General.AuctionDetails, { auctionId: id }));
      })
      .finally(() => {
        setOpen(false);
      })
      .catch(handleRtkError);
  };

  return (
    <Dialog open={open} onOpenChange={handleRestartModalOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600" type="button" onClick={() => setOpen(true)}>
          Restart
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restart product auction</DialogTitle>
          <DialogDescription>Restart product auction here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex  w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="startEndDate"
                  render={() => (
                    <FormItem className="w-full">
                      <FormLabel className="mb-1 block">Choose start / end date</FormLabel>
                      <div className="flex flex-row gap-1">
                        {addDaysRatios.map((ratio) => (
                          <Button
                            type="button"
                            className="h-5 w-10 text-xs"
                            onClick={() => handleAddStartEndDays(ratio.value)}
                            key={ratio.label}
                          >
                            +{ratio.label}
                          </Button>
                        ))}
                      </div>
                      <FormControl>
                        <DatePickerWithRange<RestartProductAuctionFormValues, 'startEndDate'>
                          field="startEndDate"
                          className="!rounded-l-md !border-l"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="paymentPeriod"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="block">Choose payment period</FormLabel>
                      <div className="flex flex-row gap-1">
                        {addDaysRatios.map((ratio) => (
                          <Button
                            type="button"
                            className="h-5 w-10 text-xs"
                            onClick={() => handleAddPaymentPeriod(ratio.value)}
                            key={ratio.label}
                          >
                            +{ratio.label}
                          </Button>
                        ))}
                      </div>
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
                              {field.value ? format(field.value, 'PPP') : <span>Pick payment period</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <DropdownCalendar
                              mode="single"
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
            </div>
            <DialogFooter className="flex w-full justify-end">
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10">
                Restart
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
