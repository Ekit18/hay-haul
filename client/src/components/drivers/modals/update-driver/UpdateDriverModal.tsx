import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { UpdateDriverValues, useUpdateDriverFormSchema } from './validation';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { RegeneratePasswordInput } from './RegeneratePasswordInput';

type UpdateDriverModalProps = {
  driver: Driver;
  handleUpdateModalOpenChange: (open: boolean) => void;
  open: boolean;
};

export function UpdateDriverModal({ driver, handleUpdateModalOpenChange, open }: UpdateDriverModalProps) {
  const [updateDriver] = driverApi.useUpdateDriverMutation();

  const updateDriverFormSchema = useUpdateDriverFormSchema();

  const form = useForm<UpdateDriverValues>({
    mode: 'onBlur',
    defaultValues: {
      email: driver.user.email,
      fullName: driver.user.fullName,
      licenseId: driver.licenseId,
      yearsOfExperience: driver.yearsOfExperience
    },
    resolver: yupResolver(updateDriverFormSchema)
  });

  const onSubmit: SubmitHandler<UpdateDriverValues> = async (data) => {
    await updateDriver({ id: driver.id, data })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Driver updated',
          description: 'Driver has been updated successfully.'
        });
        form.reset();
      })
      .finally(() => handleUpdateModalOpenChange(false))
      .catch(handleRtkError);
  };

  return (
    <Dialog open={open} onOpenChange={handleUpdateModalOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update new driver</DialogTitle>
          <DialogDescription>Update your new driver here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="fullname">Full name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email" {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <RegeneratePasswordInput driver={driver} />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="licenseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">License ID</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder="Enter license ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">Years of experience</FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          placeholder="Enter years of experience"
                          {...field}
                          onBlur={(e) => {
                            if (e.target.value === '') {
                              field.onChange(undefined);
                            }
                          }}
                          onChange={(e) => {
                            if (Number.isNaN(e.target.valueAsNumber)) {
                              field.onChange(undefined);
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
            <DialogFooter className="flex w-full justify-end">
              <Button type="button" onClick={form.handleSubmit(onSubmit)} className="px-10">
                Submit
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
