import { FileInputCarousel } from '@/components/carousel/FileInputCarousel';
import { Button } from '@/components/ui/button';
import { DialogFooter } from '@/components/ui/dialog';
import { DropdownCalendar } from '@/components/ui/dropdown-calendar';
import { FilterSelect } from '@/components/ui/filter-select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useAppSelector } from '@/lib/hooks/redux';
import { Product } from '@/lib/types/Product/Product.type';
import { cn } from '@/lib/utils';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { productsApi } from '@/store/reducers/products/productsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  CreateProductAuctionFormValues,
  createProductAuctionDefaultValues,
  useProductAuctionCreateFormSchema
} from './validation';

export function CreateProductAuctionForm() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const { data: farms } = facilityDetailsApi.useGetAllByUserIdQuery(user.id);

  const productAuctionFormSchema = useProductAuctionCreateFormSchema();

  const [getProductsWithNoAuctions, { data: products }] = productsApi.useLazyGetProductsNotInAuctionQuery();

  const form = useForm<CreateProductAuctionFormValues>({
    mode: 'onChange',
    defaultValues: createProductAuctionDefaultValues,
    resolver: yupResolver(productAuctionFormSchema)
  });

  const farmId = form.watch('farmId');
  const photos = form.watch('photos');

  useEffect(() => {
    if (farmId) {
      getProductsWithNoAuctions(new URLSearchParams({ farmId }));
    }
  }, [farmId]);

  const onSubmit: SubmitHandler<CreateProductAuctionFormValues> = async (data) => {
    console.log(data);
  };

  // uploadImage: builder.mutation<any, any>({
  //   query: (imageFile) => {
  //     var bodyFormData = new FormData();
  //     bodyFormData.append('file', imageFile);
  //     console.log({ bodyFormData, imageFile });
  //     return {
  //       url: '/uploader/image',
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'multipart/form-data;'
  //       },
  //       body: { bodyFormData },
  //       formData:true           //add this line 👈
  //     };
  //   }
  // })

  return (
    <Form {...form}>
      <div className="w-full flex flex-col justify-center items-center gap-10">
        <div className="w-full flex flex-row justify-between gap-10 items-center">
          <FileInputCarousel items={photos} />
          <div>
            <div className="flex flex-col w-full gap-4 py-4">
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
                      <FormLabel>Price</FormLabel>
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
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Choose start date</FormLabel>
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
                              {field.value ? format(field.value, 'PPP') : <span>Pick start date</span>}
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
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Choose end date</FormLabel>
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
                              {field.value ? format(field.value, 'PPP') : <span>Pick end date</span>}
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
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="paymentPeriod"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Choose payment period</FormLabel>
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
        <div className="w-full items-center ">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="flex justify-end w-full pb-10">
          <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10 w-full">
            Create
          </Button>
        </DialogFooter>
      </div>
    </Form>
  );
}
