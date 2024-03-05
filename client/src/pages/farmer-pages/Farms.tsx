import { DeleteModal, EntityTitle } from '@/components/delete-modal/delete-modal';
import { FacilityCard } from '@/components/facility/facility-card/facility-card';
import { CreateFacilityModal } from '@/components/facility/modals/create-facility-modal/create-facility-modal';
import { UpdateFacilityModal } from '@/components/facility/modals/update-facility-modal/update-facility-modal';
import { UpdateFacilityFormValues } from '@/components/facility/modals/update-facility-modal/validation';
import { handleRtkError } from '@/lib/helpers/handleRtkError';
import { useAppSelector } from '@/lib/hooks/redux';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { facilityDetailsApi } from '@/store/reducers/facility-details/facilityDetailsApi';
import { useCallback, useMemo, useState } from 'react';

export function Farms() {
  const user = useAppSelector((state) => state.user.user);

  if (!user) return null;

  const { data } = facilityDetailsApi.useGetAllByUserIdQuery(user.id);

  const [currentFacility, setCurrentFacility] = useState<FacilityDetails>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);

  const handleDeleteModalOpenChange = useCallback((open: boolean) => setIsDeleteModalOpen(open), []);

  const handleUpdateModalOpenChange = useCallback((open: boolean) => setIsUpdateModalOpen(open), []);

  const deleteModalConfirmName = useMemo<string>(() => currentFacility?.name ?? '>', [currentFacility]);

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
      .finally(() => setIsUpdateModalOpen(false))
      .catch(handleRtkError);
  };

  const deleteCallback = () => {
    if (!currentFacility) return;

    deleteFacility(currentFacility.id)
      .unwrap()
      .finally(() => setIsDeleteModalOpen(false))
      .catch(handleRtkError);
  };

  // TODO: add product type editing for farm page
  // TODO: add loading spinner for product table

  return (
    <div>
      <div className="mt-6">
        <div className="p-4 bg-white">
          <h2 className="text-3xl font-bold mb-9">Farm</h2>
        </div>
        <div className="px-4">
          <CreateFacilityModal entityTitle="Farm" />
        </div>
        <div className="px-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5">
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
            entityTitle={EntityTitle.Farm}
            facility={currentFacility}
            handleOpenChange={handleUpdateModalOpenChange}
            open={isUpdateModalOpen}
            updateCallback={updateCallback}
          />
          <DeleteModal
            handleOpenChange={handleDeleteModalOpenChange}
            open={isDeleteModalOpen}
            name={deleteModalConfirmName}
            entityTitle={EntityTitle.Farm}
            deleteCallback={deleteCallback}
          />
        </>
      )}
    </div>
  );
}
