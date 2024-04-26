import { useAppSelector } from '@/lib/hooks/redux';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Plus, Sparkles } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { CreateDriverValues, useCreateDriverFormSchema } from './validation';
import { PasswordInput } from '@/components/ui/password-input';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { generatePassword } from '@/lib/helpers/generatePassword';

export function CreateDriverModal() {
  const [createDriver] = driverApi.useCreateDriverMutation();

  const user = useAppSelector((state) => state.user.user);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCreateModalOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
    }
  };

  const createDriverFormSchema = useCreateDriverFormSchema();

  const form = useForm<CreateDriverValues>({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      licenseId: '',
      yearsOfExperience: 0,
      carrierId: user?.id as string
    },
    resolver: yupResolver(createDriverFormSchema)
  });

  const onSubmit: SubmitHandler<CreateDriverValues> = async (data) => {
    await createDriver(data)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Driver created',
          description: 'Driver has been created successfully.'
        });
        form.reset();
      })
      .finally(() => handleCreateModalOpenChange(false))
      .catch(handleRtkError);
    console.log(data);
  };

  const handleGeneratePasswordClick = () => {
    const password = generatePassword();
    form.setValue('password', password);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCreateModalOpenChange}>
      <DialogTrigger asChild>
        <div className="flex w-full justify-end">
          <Button className="flex gap-1 sm:ml-auto sm:w-60 md:w-auto" type="button" onClick={() => setIsOpen(true)}>
            <Plus size={20} /> Add Driver
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new driver</DialogTitle>
          <DialogDescription>Add your new driver here.</DialogDescription>
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
                        <Input placeholder="Enter email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <div className="flex w-full [&_div]:w-full">
                          <PasswordInput {...field} className="w-full rounded-e-none" placeholder="Enter password" />
                          <Button
                            variant="outline"
                            onClick={handleGeneratePasswordClick}
                            type="button"
                            className="rounded-s-none border-l-0 px-2"
                          >
                            <Sparkles size={18} strokeWidth={1.5} />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
