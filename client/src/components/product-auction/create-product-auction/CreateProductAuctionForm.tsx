import { FileInputCarousel } from '@/components/carousel/FileInputCarousel';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DropdownCalendar } from '@/components/ui/dropdown-calendar';
import { FilterSelect } from '@/components/ui/filter-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { AppRoute } from '@/lib/constants/routes';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { Product } from '@/lib/types/Product/Product.type';
import { cn } from '@/lib/utils';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { productsApi } from '@/store/reducers/products/productsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { addDaysRatios, buyoutPriceRatios } from './constants';
import {
  CreateProductAuctionFormValues,
  createProductAuctionDefaultValues,
  useProductAuctionCreateFormSchema
} from './validation';

export function CreateProductAuctionForm() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const { data: farms } = facilityDetailsApi.useGetAllByUserIdQuery(user.id);

  const productAuctionFormSchema = useProductAuctionCreateFormSchema();

  const [getProductsWithNoAuctions, { data: products }] = productsApi.useLazyGetProductsNotInAuctionQuery();

  const [createProductAuction] = productAuctionApi.useCreateProductAuctionMutation();

  const form = useForm<CreateProductAuctionFormValues>({
    mode: 'onChange',
    defaultValues: createProductAuctionDefaultValues,
    resolver: yupResolver(productAuctionFormSchema)
  });

  const farmId = form.watch('farmId');
  const photos = form.watch('photos');
  const startPrice = form.watch('startPrice');
  const buyoutPrice = form.watch('buyoutPrice');
  const startEndDate = form.watch('startEndDate');
  const paymentPeriod = form.watch('paymentPeriod');
  // const { fields: photos } = useFieldArray({ control: form.control, name: 'photos' });

  useEffect(() => {
    if (farmId) {
      getProductsWithNoAuctions(new URLSearchParams({ farmId }));
    }
  }, [farmId]);

  const onSubmit: SubmitHandler<CreateProductAuctionFormValues> = async (data) => {
    await createProductAuction(data)
      .unwrap()
      .then(() => navigate(AppRoute.General.MyAuctions))
      .catch(handleRtkError);
  };

  const handleAddBuyoutPrice = (percent: number) => {
    form.setValue('buyoutPrice', buyoutPrice + startPrice * percent);
  };

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

  const selectedProductName = useMemo(() => {
    return products && products.data.find((product) => product.id === form.getValues('productId'))?.name;
  }, [form.watch('productId')]);

  return (
    <Form {...form}>
      <div className="flex w-full flex-col items-center justify-center gap-10 bg-gray-100">
        <h3 className="min-h-8 self-start text-2xl font-bold">{selectedProductName}</h3>
        <div className="flex w-full flex-col items-center justify-start xl:flex-row">
          <div className="flex w-full justify-center xl:w-6/12">
            <FileInputCarousel items={photos} hasAddButton />
          </div>
          <div className="w-full xl:w-6/12">
            <div className="flex w-full flex-row gap-4 py-4">
              <div className="flex w-full flex-col gap-4">
                <FilterSelect
                  fieldName="farmId"
                  title="Farm"
                  values={farms}
                  placeholder="Select a farm"
                  valueProperty="name"
                  containerClassName="w-full items-center"
                />
                <FilterSelect
                  fieldName="productId"
                  title="Product"
                  values={products?.data as Product[]}
                  placeholder="Select a product"
                  valueProperty="name"
                  containerClassName="w-full items-center"
                />
                <div className="w-full items-center ">
                  <FormField
                    control={form.control}
                    name="startPrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Start price</FormLabel>
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
                                form.setValue('buyoutPrice', 0);
                                return;
                              }
                              if (e.target.valueAsNumber <= 0) {
                                return;
                              }
                              field.onChange(e.target.valueAsNumber);
                              form.setValue('buyoutPrice', e.target.valueAsNumber + e.target.valueAsNumber * 0.25);
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
                <div className="w-full items-center ">
                  <FormField
                    control={form.control}
                    name="buyoutPrice"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Buyout price</FormLabel>
                        <div className="flex flex-row gap-1">
                          {buyoutPriceRatios.map((ratio) => (
                            <Button
                              type="button"
                              key={ratio.label}
                              className="h-5 w-10 text-xs"
                              disabled={!startPrice}
                              onClick={() => handleAddBuyoutPrice(ratio.value)}
                            >
                              +{ratio.label}
                            </Button>
                          ))}
                        </div>
                        <FormControl>
                          <Input
                            placeholder="Enter buyout price"
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
                </div>
              </div>
              <div className="flex w-full flex-col gap-4">
                <div className="w-full items-center ">
                  <FormField
                    control={form.control}
                    name="bidStep"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Bid step</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter bid step"
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
                </div>
                <div className="w-full items-center ">
                  <FormField
                    control={form.control}
                    name="startEndDate"
                    render={() => (
                      <FormItem className="w-full">
                        <FormLabel className="block">Choose start / end date</FormLabel>
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
                          <DatePickerWithRange<CreateProductAuctionFormValues, 'startEndDate'>
                            field="startEndDate"
                            title="Start / end date"
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
                                  'w-[240px] justify-start text-left font-normal',
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
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-5 self-start xl:flex-row xl:justify-between">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    maxLength={255}
                    className="max-h-32 w-full xl:w-2/3"
                    placeholder="Enter description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex h-full w-full items-center gap-4 self-end pb-5 xl:w-1/3">
            <Button
              type="button"
              onClick={() => navigate(AppRoute.General.MyAuctions)}
              className="w-full bg-gray-500 px-10"
            >
              Back
            </Button>
            <Button type="button" onClick={form.handleSubmit(onSubmit)} className="w-full px-10">
              Create
            </Button>
          </div>
        </div>
      </div>
    </Form>
  );
}
