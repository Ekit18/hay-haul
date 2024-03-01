import { FacilityDetails } from '@/lib/types/FacilityDetails/FacilityDetails.type';
import { api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export const facilityDetailsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllByUserId: builder.query<FacilityDetails[], string>({
      query: (userId: string) => generatePath('facility-details/user/:userId', { userId })
    })
  })
});
