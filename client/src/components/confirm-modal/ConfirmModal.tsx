import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { EmptyCallback } from '@/lib/types/types';
import React from 'react';

export type ConfirmModalProps = {
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  message: React.ReactNode;
  confirmCallback: EmptyCallback;
};

export function ConfirmModal({ open, handleOpenChange, message, confirmCallback }: ConfirmModalProps) {
  const onSubmit = async () => confirmCallback();

  const handleCancelClick = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm action</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full justify-end">
          <Button
            type="button"
            onClick={handleCancelClick}
            variant="default"
            className="bg-gray-400 px-10 hover:bg-gray-500"
          >
            Cancel
          </Button>
          <Button type="button" onClick={onSubmit} variant="default" className="bg-primary px-10">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
