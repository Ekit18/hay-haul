import { DeleteModal } from '@/components/delete-modal/delete-modal';
import { FacilityCard } from '@/components/facility/facility-card/FacilityCard';
import { CreateFacilityModal } from '@/components/facility/modals/create-facility-modal/CreateFacilityModal';
import { UpdateFacilityModal } from '@/components/facility/modals/update-facility-modal/UpdateFacilityModal';
import { UpdateFacilityFormValues } from '@/components/facility/modals/update-facility-modal/validation';
import { toast } from '@/components/ui/use-toast';
import { EntityTitle } from '@/lib/enums/entity-title.enum';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { useCallback, useEffect, useState } from 'react';

export function Depots() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const { data } = facilityDetailsApi.useGetAllByUserIdQuery(user.id);

  const [currentFacility, setCurrentFacility] = useState<FacilityDetails>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const handleDeleteModalOpenChange = useCallback((open: boolean) => setIsDeleteModalOpen(open), []);

  const handleUpdateModalOpenChange = useCallback((open: boolean) => setIsUpdateModalOpen(open), []);

  const handleEditClick = (facility: FacilityDetails) => {
    setCurrentFacility(facility);
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (facility: FacilityDetails) => {
    setCurrentFacility(facility);
    setIsDeleteModalOpen(true);
  };

  const [deleteFacility] = facilityDetailsApi.useDeleteFacilityMutation();
  const [updateFacility] = facilityDetailsApi.useUpdateFacilityMutation();

  const updateCallback = (data: UpdateFacilityFormValues) => {
    if (!currentFacility) return;

    updateFacility({ id: currentFacility.id, body: data })
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Warehouse was updated',
          description: 'Your warehouse has been updated successfully.'
        });
      })
      .finally(() => setIsUpdateModalOpen(false))
      .catch(handleRtkError);
  };

  const deleteCallback = () => {
    if (!currentFacility) return;

    deleteFacility(currentFacility.id)
      .unwrap()
      .then(() => {
        toast({
          variant: 'success',
          title: 'Warehouse was deleted',
          description: 'Your warehouse has been deleted successfully.'
        });
      })
      .finally(() => setIsDeleteModalOpen(false))
      .catch(handleRtkError);
  };

  useEffect(() => {
    if (!currentFacility) return;

    setCurrentFacility(data?.find((facility) => facility.id === currentFacility.id));
  }, [data]);

  return (
    <>
      <div className="mt-6">
        <div className="bg-white p-4">
          <h2 className="mb-9 text-3xl font-bold">Depots</h2>
        </div>
        <div className="px-4">
          <CreateFacilityModal entityTitle={EntityTitle.Depots} />
        </div>
        <div className="grid w-full grid-cols-1 gap-4 px-4 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((facility) => (
            <FacilityCard
              key={facility.id}
              facilityDetails={facility}
              onEditClick={() => handleEditClick(facility)}
              onDeleteClick={() => handleDeleteClick(facility)}
            />
          ))}
        </div>
      </div>

      {currentFacility && (
        <>
          <UpdateFacilityModal
            entityTitle={EntityTitle.Depots}
            facility={currentFacility}
            handleOpenChange={handleUpdateModalOpenChange}
            open={isUpdateModalOpen}
            updateCallback={updateCallback}
          />
          <DeleteModal
            handleOpenChange={handleDeleteModalOpenChange}
            open={isDeleteModalOpen}
            name={currentFacility?.name}
            entityTitle={EntityTitle.Depots}
            deleteCallback={deleteCallback}
          />
        </>
      )}
    </>
  );
}
