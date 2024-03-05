import { CreateFacilityFormValues } from '@/components/facility/modals/create-facility-modal/validation';
import { UpdateFacilityFormValues } from '@/components/facility/modals/update-facility-modal/validation';
import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type CreateFacilityDto = CreateFacilityFormValues & {
  userId: string;
};
export type UpdateFacilityDto = {
  body: UpdateFacilityFormValues;
  id: string;
};

export const facilityDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllByUserId: builder.query<FacilityDetails[], string>({
      query: (userId: string) => generatePath('facility-details/user/:userId', { userId }),
      providesTags: [TagType.Facility]
    }),
    createFacility: builder.mutation<FacilityDetails, CreateFacilityDto>({
      query: ({ userId, ...body }) => ({
        method: 'POST',
        url: generatePath('/facility-details/user/:userId', {
          userId
        }),
        body
      }),
      invalidatesTags: [TagType.Facility]
    }),
    updateFacility: builder.mutation<FacilityDetails, UpdateFacilityDto>({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: generatePath('/facility-details/:id', {
          id
        }),
        body
      }),
      invalidatesTags: [TagType.Facility]
    }),
    deleteFacility: builder.mutation<void, string>({
      query: (id) => ({
        method: 'DELETE',
        url: generatePath('/facility-details/:id', {
          id
        })
      }),
      invalidatesTags: [TagType.Facility]
    })
  })
});
