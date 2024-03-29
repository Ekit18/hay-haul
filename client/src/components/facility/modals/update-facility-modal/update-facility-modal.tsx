import { farmProductTypesSuggestions } from '@/components/auth/sign-up/facility-form/farmProductTypesSuggestions';
import { TagInput } from '@/components/tag-input/TagInput';
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
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { EntityTitleValues } from '@/lib/types/types';
import { productsTypesApi } from '@/store/reducers/product-types/productsTypesApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UpdateFacilityFormValues, updateFacilityDefaultValues, useFacilityUpdateFormSchema } from './validation';

export type UpdateFacilityModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  updateCallback: (data: UpdateFacilityFormValues) => void;
  facility: FacilityDetails;
  entityTitle: EntityTitleValues;
};

export function UpdateFacilityModal({
  facility,
  entityTitle,
  open,
  updateCallback,
  handleOpenChange
}: UpdateFacilityModalProps) {
  const user = useAppSelector((state) => state.user.user);

  const [createProductType] = productsTypesApi.useCreateProductTypeMutation();
  const [deleteProductType] = productsTypesApi.useDeleteProductTypeMutation();

  if (!user) {
    return null;
  }

  const updateFacilityFormSchema = useFacilityUpdateFormSchema();

  const form = useForm<UpdateFacilityFormValues>({
    mode: 'onBlur',
    defaultValues: updateFacilityDefaultValues,
    values: {
      name: facility.name,
      address: facility.address,
      code: facility.code,
      farmProductTypes: facility?.productTypes?.map((item) => item.name) || []
    },
    resolver: yupResolver(updateFacilityFormSchema)
  });

  const onSubmit: SubmitHandler<UpdateFacilityFormValues> = updateCallback;

  const handleAdd = async (name: string) => {
    await createProductType({ name, farmId: facility.id }).unwrap().catch(handleRtkError);
  };

  const handleDelete = async (i: number) => {
    const productTypeId = facility.productTypes?.[i].id;

    if (!productTypeId) return;

    return deleteProductType(productTypeId).unwrap();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update {entityTitle.toLowerCase()}</DialogTitle>
          <DialogDescription>Update {entityTitle.toLowerCase()} related data here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="w-full flex flex-col justify-center items-center gap-10">
            <div className="flex flex-col w-full gap-4 py-4">
              <div className="w-full items-center ">
                <TagInput
                  name="farmProductTypes"
                  control={form.control}
                  suggestions={farmProductTypesSuggestions}
                  labelText="Select farm products"
                  noOptionsText="No matching products"
                  allowNew
                  onAdd={handleAdd}
                  onDelete={handleDelete}
                  selectedFn={(item) => ({ value: item, label: item })}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{entityTitle} name</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter name of the ${entityTitle.toLowerCase()}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{entityTitle} address</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter address of the ${entityTitle.toLowerCase()}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facility code (EDRPOU)</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter code of the ${entityTitle.toLowerCase()}`} {...field} />
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
