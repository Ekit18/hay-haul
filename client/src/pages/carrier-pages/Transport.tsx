import { CreateTransportModal } from '@/components/transport/modals/create-transport/CreateTransportModal';
import { cn } from '@/lib/utils';
import { TransportCard } from '@/components/transport/transport-card/TransportCard';
import { transportApi } from '@/store/reducers/transport/trasportApi';
import { useAppSelector } from '@/lib/hooks/redux';
import { Loader2 } from 'lucide-react';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { useState } from 'react';
import { Transport as TransportType } from '@/lib/types/Transport/Transport.type';
import { toast } from '@/components/ui/use-toast';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { UpdateTransportModal } from '@/components/transport/modals/update-transport/UpdateTransportModal';

export function Transport() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) {
    return null;
  }

  const {
    data: transports,
    isLoading,
    isFetching
  } = transportApi.useGetAllCarrierTransportsQuery({ carrierId: user.id });

  const [deleteTransport] = transportApi.useDeleteTransportMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [chosenTransport, setChosenTransport] = useState<TransportType | null>(null);

  const handleDeleteTransport = async () => {
    if (!chosenTransport) {
      return;
    }

    await deleteTransport(chosenTransport.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Transport deleted',
          description: 'Transport has been deleted successfully.'
        });
        setOpenDeleteModal(false);
      })
      .catch(handleRtkError);
  };

  const handleDeleteClick = (transport: TransportType) => {
    setChosenTransport(transport);
    setOpenDeleteModal(true);
  };

  const handleUpdateClick = (transport: TransportType) => {
    setChosenTransport(transport);
    setOpenUpdateModal(true);
  };

  const handleOpenDeleteChange = (open: boolean) => {
    if (!open) {
      setOpenDeleteModal(false);
      setChosenTransport(null);
    }
  };

  const handleOpenUpdateChange = (open: boolean) => {
    if (!open) {
      setOpenUpdateModal(false);
      setChosenTransport(null);
    }
  };

  if (isFetching || isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-100 pb-4">
      <div className="bg-white p-4 pt-10">
        <h2 className="mb-9 text-3xl font-bold">Transport</h2>
        <CreateTransportModal />
      </div>

      <div
        className={cn(
          'grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 py-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
        )}
      >
        {transports?.map((transport) => (
          <TransportCard
            key={transport.id}
            transport={transport}
            onEditClick={() => handleUpdateClick(transport)}
            onDeleteClick={() => handleDeleteClick(transport)}
          />
        ))}
      </div>
      {chosenTransport && (
        <>
          <DeleteModal
            name={chosenTransport?.name as string}
            open={openDeleteModal}
            handleOpenChange={handleOpenDeleteChange}
            deleteCallback={handleDeleteTransport}
            entityTitle={EntityTitle.CarrierTransport}
          />
          <UpdateTransportModal
            transport={chosenTransport}
            handleUpdateModalOpenChange={handleOpenUpdateChange}
            open={openUpdateModal}
          />
        </>
      )}
    </div>
  );
}
