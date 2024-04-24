import { useAppSelector } from '@/lib/hooks/redux';
import { useState } from 'react';
import { CreateTransportValues, useCreateTransportFormSchema } from './validation';
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
import { Plus } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { transportTypes } from './constants';
import { Input } from '@/components/ui/input';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';

export function CreateTransportModal() {
  const [createTransport] = transportApi.useCreateTransportMutation();

  const user = useAppSelector((state) => state.user.user);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleCreateModalOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
    }
  };

  const createTransportFormSchema = useCreateTransportFormSchema();

  const form = useForm<CreateTransportValues>({
    mode: 'onBlur',
    defaultValues: {
      carrierId: user?.id,
      type: '',
      licensePlate: '',
      name: ''
    },
    resolver: yupResolver(createTransportFormSchema)
  });

  const onSubmit: SubmitHandler<CreateTransportValues> = async (data) => {
    await createTransport(data)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Transport created',
          description: 'Transport has been created successfully.'
        });
        form.reset();
      })
      .finally(() => handleCreateModalOpenChange(false))
      .catch(handleRtkError);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCreateModalOpenChange}>
      <DialogTrigger asChild>
        <div className="flex w-full justify-end">
          <Button className="flex gap-1 sm:ml-auto sm:w-60 md:w-auto" type="button" onClick={() => setIsOpen(true)}>
            <Plus size={20} /> Add Transport
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new transport</DialogTitle>
          <DialogDescription>Add your new transport here.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Transport type</FormLabel>
                      <Select
                        onValueChange={(type) => {
                          field.onChange(type);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type of the truck" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {transportTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon size={16} /> {type.label}
                                </div>
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
              <div className="w-full items-center">
                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">Enter license plate</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder="License plate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full items-center">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block">Enter name of the transport</FormLabel>
                      <FormControl>
                        <Input className="w-full" placeholder="Name" {...field} />
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
