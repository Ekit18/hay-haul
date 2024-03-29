import { farmProductTypesSuggestions } from '@/components/auth/sign-up/facility-form/farmProductTypesSuggestions';
import { TagInput } from '@/components/tag-input/TagInput';
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
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { EntityTitleValues } from '@/lib/types/types';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { yupResolver } from '@hookform/resolvers/yup';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CreateFacilityFormValues, createFacilityDefaultValues, useFacilityCreateFormSchema } from './validation';

export type CreateFacilityModalProps = { entityTitle: EntityTitleValues };
export function CreateFacilityModal({ entityTitle }: CreateFacilityModalProps) {
  const createFacilityFormSchema = useFacilityCreateFormSchema();

  const [createFacility] = facilityDetailsApi.useCreateFacilityMutation();

  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const form = useForm<CreateFacilityFormValues>({
    mode: 'onChange',
    defaultValues: createFacilityDefaultValues,
    resolver: yupResolver(createFacilityFormSchema)
  });

  const [open, setOpen] = useState(false);

  const handleDeleteModalOpenChange = (open: boolean) => {
    setOpen(open);
  };

  const onSubmit: SubmitHandler<CreateFacilityFormValues> = async (data) => {
    await createFacility({ ...data, userId: user.id })
      .unwrap()
      .finally(() => {
        setOpen(false);
        form.reset();
      })
      .catch(handleRtkError);
  };

  return (
    <Dialog open={open} onOpenChange={handleDeleteModalOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex gap-1 ml-auto" type="button" onClick={() => setOpen(true)}>
          <Plus size={20} /> Create {entityTitle.toLowerCase()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new {entityTitle.toLowerCase()}</DialogTitle>
          <DialogDescription>Add your new {entityTitle.toLowerCase()} here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                <Button type="submit" className="px-10">
                  Create
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
