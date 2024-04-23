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
import { EmptyCallback, EntityTitleValues } from '@/lib/types/types';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DeleteFormValues, deleteDefaultValues, useDeleteFormSchema } from './validation';

export type DeleteModalProps = {
  name: string;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  deleteCallback: EmptyCallback;
  entityTitle: EntityTitleValues;
};

export function DeleteModal({ open, handleOpenChange, name, deleteCallback, entityTitle }: DeleteModalProps) {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const deleteFormSchema = useDeleteFormSchema();

  const form = useForm<DeleteFormValues>({
    mode: 'onSubmit',
    defaultValues: deleteDefaultValues,
    values: { confirmName: '', originalName: name.trim() },
    resolver: yupResolver(deleteFormSchema)
  });

  const onSubmit: SubmitHandler<DeleteFormValues> = async () => deleteCallback();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {entityTitle.toLocaleLowerCase()}</DialogTitle>
          <DialogDescription>
            Type {entityTitle.toLocaleLowerCase()} name
            <span className="font-bold"> {name} </span>
            to confirm.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex w-full flex-col items-center justify-center gap-10">
            <div className="flex w-full flex-col gap-4 py-4">
              <div className="w-full items-center ">
                <FormField
                  control={form.control}
                  name="confirmName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{entityTitle} name</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter name of the ${entityTitle}`} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="flex w-full justify-end">
              <Button type="button" onClick={form.handleSubmit(onSubmit)} variant="destructive" className="px-10">
                Delete
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
