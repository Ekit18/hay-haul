import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAppSelector } from '@/lib/hooks/redux';
import { Product } from '@/lib/types/Product/Product.type';
import { yupResolver } from '@hookform/resolvers/yup';
import pick from 'lodash.pick';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdateProductFormValues, updateProductDefaultValues, useProductUpdateFormSchema } from './validation';

export type UpdateProductModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  updateCallback: (data: UpdateProductFormValues) => void;
  product: Product;
};
export function UpdateProductModal({ product, open, updateCallback, handleOpenChange }: UpdateProductModalProps) {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const updateProductFormSchema = useProductUpdateFormSchema();

  const form = useForm<UpdateProductFormValues>({
    mode: 'onBlur',
    defaultValues: updateProductDefaultValues,
    values: pick(product, ['name', 'quantity']),
    resolver: yupResolver(updateProductFormSchema)
  });

  const onSubmit: SubmitHandler<UpdateProductFormValues> = updateCallback;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update product</DialogTitle>
          <DialogDescription>Update product related data here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="w-full flex flex-col justify-center items-center gap-10">
            <div className="flex flex-col w-full gap-4 py-4">
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
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Quantity"
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
            <DialogFooter className="flex justify-end w-full">
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10">
                Update
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
