import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { DriverCard } from '@/components/drivers/card/DriverCard';
import { CreateDriverModal } from '@/components/drivers/modals/create-driver/CreateDriverModal';
import { UpdateDriverModal } from '@/components/drivers/modals/update-driver/UpdateDriverModal';
import { toast } from '@/components/ui/use-toast';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { cn } from '@/lib/utils';
import { driverApi } from '@/store/reducers/driver-details/driverApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export function Drivers() {
  const user = useAppSelector((state) => state.user.user);

  const { data, isLoading, isFetching } = driverApi.useGetAllDriversByCarrierIdQuery(
    user?.id ? { carrierId: user?.id ?? '' } : skipToken
  );

  const [deleteDriver] = driverApi.useDeleteDriverMutation();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const [chosenDriver, setChosenDriver] = useState<Driver | null>(null);

  const handleDeleteDriver = async () => {
    if (!chosenDriver) {
      return;
    }

    await deleteDriver(chosenDriver.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Driver deleted',
          description: 'Driver has been deleted successfully.'
        });
        setOpenDeleteModal(false);
      })
      .catch(handleRtkError);
  };

  const handleDeleteClick = (driver: Driver) => {
    setChosenDriver(driver);
    setOpenDeleteModal(true);
  };

  const handleUpdateClick = (driver: Driver) => {
    setChosenDriver(driver);
    setOpenUpdateModal(true);
  };

  const handleOpenDeleteChange = (open: boolean) => {
    if (!open) {
      setOpenDeleteModal(false);
      setChosenDriver(null);
    }
  };

  const handleOpenUpdateChange = (open: boolean) => {
    if (!open) {
      setOpenUpdateModal(false);
      setChosenDriver(null);
    }
  };

  return (
    <div className="h-full bg-gray-100 pb-4">
      <div className="bg-white p-4 pt-10">
        <h2 className="mb-9 text-3xl font-bold">Drivers</h2>
        <CreateDriverModal />
      </div>
      {isFetching || isLoading ? (
        <div className="flex h-full w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin" />
        </div>
      ) : (
        <div
          className={cn(
            'grid w-full grid-cols-1 gap-4 bg-gray-100 px-4 py-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
          )}
        >
          {data?.data?.map((driver) => (
            <DriverCard
              driver={driver}
              key={driver.id}
              onEditClick={() => handleUpdateClick(driver)}
              onDeleteClick={() => handleDeleteClick(driver)}
            />
          ))}
        </div>
      )}

      {chosenDriver && (
        <>
          <DeleteModal
            name={chosenDriver.user.fullName}
            open={openDeleteModal}
            handleOpenChange={handleOpenDeleteChange}
            deleteCallback={handleDeleteDriver}
            entityTitle={EntityTitle.CarrierDriver}
          />
          <UpdateDriverModal
            driver={chosenDriver}
            handleUpdateModalOpenChange={handleOpenUpdateChange}
            open={openUpdateModal}
          />
        </>
      )}
    </div>
  );
}
