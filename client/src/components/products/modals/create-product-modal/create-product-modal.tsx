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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { productsApi } from '@/store/reducers/products/productsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateProductFormValues, createProductDefaultValues, useProductCreateFormSchema } from './validation';

export function CreateProductModal() {
  const user = useAppSelector((state) => state.user.user);
  const [createProduct] = productsApi.useCreateProductMutation();
  if (!user) {
    return null;
  }

  const userId = user.id;

  const createProductFormSchema = useProductCreateFormSchema();

  const form = useForm<CreateProductFormValues>({
    mode: 'onBlur',
    defaultValues: createProductDefaultValues,
    resolver: yupResolver(createProductFormSchema)
  });

  const farmId = form.watch('farmId');

  useEffect(() => {
    form.setValue('productTypeId', '');
  }, [farmId]);

  const [open, setOpen] = useState(false);

  const { data: farms } = facilityDetailsApi.useGetAllByUserIdQuery(userId);

  const productTypesByFarmId = farms?.find((farm) => farm.id === farmId)?.productTypes || [];

  const handleCreateModalOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(false);
    }
  };

  const onSubmit: SubmitHandler<CreateProductFormValues> = async (data) => {
    await createProduct(data)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Product created',
          description: 'Product has been created successfully.'
        });
        form.reset();
      })
      .finally(() => {
        setOpen(false);
      })
      .catch(handleRtkError);
  };

  return (
    <Dialog open={open} onOpenChange={handleCreateModalOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 sm:ml-auto sm:w-60 md:w-auto" type="button" onClick={() => setOpen(true)}>
          <Plus size={20} /> Create Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new product</DialogTitle>
          <DialogDescription>Add your new product here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="farmId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Farm</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!farms?.length}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a farm" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {farms?.map((farm) => (
                              <SelectItem key={farm.id} value={farm.id}>
                                {farm.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="productTypeId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Product type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!farms?.length || !farmId}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type of the product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {productTypesByFarmId?.map((farm) => (
                              <SelectItem key={farm.id} value={farm.id}>
                                {farm.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter name of the product" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity (ton)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter quantity"
                          {...field}
                          value={field.value || ''}
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
