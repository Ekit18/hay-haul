import { Transport } from '@/lib/types/Transport/Transport.type';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { useState } from 'react';
import { UpdateTransportValues, useUpdateTransportFormSchema } from './validation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { transportTypes } from '../create-transport/constants';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type UpdateTransportModalProps = {
  transport: Transport;
  handleUpdateModalOpenChange: (open: boolean) => void;
  open: boolean;
};

export function UpdateTransportModal({ transport, open, handleUpdateModalOpenChange }: UpdateTransportModalProps) {
  const [updateTransport] = transportApi.useUpdateTransportMutation();

  const updateTransportFormSchema = useUpdateTransportFormSchema();

  const form = useForm<UpdateTransportValues>({
    mode: 'onBlur',
    defaultValues: {
      type: transport.type,
      licensePlate: transport.licensePlate,
      name: transport.name
    },
    resolver: yupResolver(updateTransportFormSchema)
  });

  const onSubmit = async (data: UpdateTransportValues) => {
    console.log(data);
    await updateTransport({ id: transport.id, data })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Transport updated',
          description: 'Transport has been updated successfully.'
        });
        form.reset();
      })
      .finally(() => handleUpdateModalOpenChange(false))
      .catch(handleRtkError);
  };

  console.log(form.formState.errors);

  return (
    <Dialog open={open} onOpenChange={handleUpdateModalOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update transport {transport.name}</DialogTitle>
          <DialogDescription>Update your new transport here.</DialogDescription>
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
