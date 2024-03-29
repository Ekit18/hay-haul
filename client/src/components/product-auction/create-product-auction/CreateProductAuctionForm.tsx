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
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
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

  return (
    <Form {...form}>
      <div className="w-full flex flex-col justify-center items-center gap-10 bg-gray-100">
        <div className="w-full flex flex-col xl:flex-row justify-start items-center">
          <div className="w-full xl:w-6/12 flex justify-center">
            <FileInputCarousel items={photos} />
          </div>
          <div className="w-full xl:w-6/12">
            <div className="flex flex-row w-full gap-4 py-4">
              <div className="w-full">
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
                        <FormControl>
                          <Input
                            placeholder="Enter buyout price"
                            {...field}
                            onBlur={(e) => {
                              if (e.target.value === '') {
                                field.onChange(0);
                              }
                            }}
                            type="number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full">
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
        <div className="w-1/2 self-start">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea className="max-h-36" placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 self-end pb-10">
          <Button
            type="button"
            onClick={() => navigate(AppRoute.General.MyAuctions)}
            className="px-10 w-full bg-gray-500"
          >
            Back
          </Button>
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10 w-full">
            Create
          </Button>
        </div>
      </div>
    </Form>
  );
}
