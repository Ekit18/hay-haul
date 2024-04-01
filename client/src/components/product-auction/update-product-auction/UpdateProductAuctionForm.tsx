import { FileInputCarousel } from '@/components/carousel/FileInputCarousel';
import { Button } from '@/components/ui/button';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { DropdownCalendar } from '@/components/ui/dropdown-calendar';
import { FilterSelect } from '@/components/ui/filter-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { AppRoute } from '@/lib/constants/routes';
import { convertSrcToFile } from '@/lib/helpers/convertSrcToFile';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { ProductAuctionStatus, ProductAuctionStatusValues } from '@/lib/types/ProductAuction/ProductAuction.type';
import { cn } from '@/lib/utils';
import { productAuctionApi } from '@/store/reducers/product-auction/productAuctionApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { addDays, format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { addDaysRatios, buyoutPriceRatios } from '../create-product-auction/constants';
import { UpdateProductAuctionFormValues, useProductAuctionUpdateFormSchema } from './validation';

export function UpdateProductAuctionForm() {
  const navigate = useNavigate();

  const { id } = useParams();

  if (!id || typeof id !== 'string') {
    return <Navigate to={AppRoute.General.MyAuctions} replace />;
  }

  const [loading, setLoading] = useState(true);

  const [getProductAuction, { data: auction }] = productAuctionApi.useLazyGetProductAuctionQuery();

  const productAuctionFormSchema = useProductAuctionUpdateFormSchema();

  const [updateProductAuction] = productAuctionApi.useUpdateProductAuctionMutation();

  const [auctionInitialValues, setAuctionInitialValues] = useState<UpdateProductAuctionFormValues | undefined>({
    startPrice: 0,
    buyoutPrice: 0,
    startEndDate: { to: new Date(), from: new Date() },
    paymentPeriod: new Date(),
    bidStep: 0,
    description: '',
    productName: '',
    farmName: '',
    photos: []
  });

  useEffect(() => {
    getProductAuction(id)
      .unwrap()
      .then((auction) => {
        Promise.all(
          auction.photos.map((photo) =>
            convertSrcToFile({ fileName: photo.name, mimeType: photo.contentType, url: photo.signedUrl, id: photo.id })
          )
        )
          .then((photos) => {
            setAuctionInitialValues({
              startPrice: auction.startPrice,
              buyoutPrice: auction.buyoutPrice,
              bidStep: auction.bidStep,
              description: auction.description,
              farmName: auction.product.facilityDetails.name,
              productName: auction.product.name,
              paymentPeriod: new Date(auction.paymentPeriod),
              startEndDate: { to: new Date(auction.endDate), from: new Date(auction.startDate) },
              photos
            });
          })
          .finally(() => {
            setLoading(false);
          });
      })
      .catch(handleRtkError);
  }, [id]);

  const form = useForm<UpdateProductAuctionFormValues>({
    mode: 'onChange',
    values: auctionInitialValues,
    resolver: yupResolver(productAuctionFormSchema)
  });

  const photos = form.watch('photos');
  const startPrice = form.watch('startPrice');
  const buyoutPrice = form.watch('buyoutPrice');
  const startEndDate = form.watch('startEndDate');
  const paymentPeriod = form.watch('paymentPeriod');
  // const { fields: photos } = useFieldArray({ control: form.control, name: 'photos' });
  const onSubmit: SubmitHandler<UpdateProductAuctionFormValues> = async (data) => {
    if (!id) {
      return;
    }
    await updateProductAuction({ body: data, id })
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

  if (loading) return null;
  if (!auction) return <Navigate to={AppRoute.General.MyAuctions} replace />;
  if (
    !([ProductAuctionStatus.Inactive, ProductAuctionStatus.StartSoon] as ProductAuctionStatusValues[]).includes(
      auction.auctionStatus
    )
  ) {
    toast({
      variant: 'destructive',
      title: 'Something went wrong',
      description: 'You can only update inactive or start soon auctions.'
    });
    return <Navigate to={AppRoute.General.MyAuctions} replace />;
  }

  return (
    <>
      <Form {...form}>
        <div className="w-full flex flex-col justify-center items-center gap-10 bg-gray-100">
          <h3 className="self-start text-2xl font-bold">{auction.product.name}</h3>
          <div className="w-full flex flex-col xl:flex-row justify-start items-center">
            <div className="w-full xl:w-6/12 flex justify-center">
              <FileInputCarousel items={photos} />
            </div>
            <div className="w-full xl:w-6/12">
              <div className="flex flex-row w-full gap-4 py-4">
                <div className="w-full flex flex-col gap-4">
                  <FilterSelect
                    fieldName="farmName"
                    title="Farm"
                    disabled
                    values={[auction.product.facilityDetails.name]}
                    placeholder="Select a farm"
                    containerClassName="w-full items-center"
                  />
                  <FilterSelect
                    fieldName="productName"
                    title="Product"
                    disabled
                    placeholder="Select a product"
                    values={[auction.product.name]}
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
                                className="w-10 text-xs h-5"
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
                <div className="w-full flex flex-col gap-4">
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
                                className="w-10 text-xs h-5"
                                onClick={() => handleAddStartEndDays(ratio.value)}
                                key={ratio.label}
                              >
                                +{ratio.label}
                              </Button>
                            ))}
                          </div>
                          <FormControl>
                            <DatePickerWithRange<UpdateProductAuctionFormValues, 'startEndDate'>
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
                                className="w-10 text-xs h-5"
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
          <div className="w-full self-start flex flex-col xl:flex-row items-center xl:justify-between justify-center gap-5">
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
            <div className="flex w-full xl:w-1/3 gap-4 self-end items-center h-full pb-5">
              <Button
                type="button"
                onClick={() => navigate(AppRoute.General.MyAuctions)}
                className="px-10 w-full bg-gray-500"
              >
                Back
              </Button>
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10 w-full">
                Save
              </Button>
            </div>
          </div>
        </div>
      </Form>
    </>
  );
}
