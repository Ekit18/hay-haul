import { CreateDriverValues } from '@/components/drivers/modals/create-driver/validation';
import { UpdateDriverValues } from '@/components/drivers/modals/update-driver/validation';
import { Driver } from '@/lib/types/Driver/Driver.type';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type GetAllDriversByCarrierIdDto = {
    carrierId: string;
    searchParams?: URLSearchParams | undefined;
}

export type RegenerateDriverPasswordDto = {
    driverId: string;
    password: string;
}

export const driverApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDriver: builder.mutation<void, CreateDriverValues>({
            query: ({ carrierId, ...body }) => ({
                url: generatePath('/driver-details/carrier/:carrierId', { carrierId }),
                method: 'POST',
                body
            }),
            invalidatesTags: [TagType.Drivers]
        }),
        regenerateDriverPassword: builder.mutation<void, RegenerateDriverPasswordDto>({
            query: ({ driverId, ...body }) => ({
                url: generatePath('/driver-details/regenerate-password/:driverId', { driverId }),
                method: 'POST',
                body
            }),
        }),
        getAllDriversByCarrierId: builder.query<DataWithCount<Driver>, GetAllDriversByCarrierIdDto>({
            query: ({ carrierId, searchParams }) => ({
                url: generatePath('/driver-details/carrier/:carrierId', { carrierId }),
                params: searchParams
            }),
            providesTags: [TagType.Drivers]
        }),
        deleteDriver: builder.mutation<void, string>({
            query: (id) => ({
                url: generatePath('/driver-details/:id', { id }),
                method: 'DELETE',

            }),
            invalidatesTags: [TagType.Drivers]
        }),
        updateDriver: builder.mutation<void, { id: string, data: Partial<UpdateDriverValues> }>({
            query: ({ id, data }) => ({
                url: generatePath('/driver-details/:id', { id }),
                method: 'PUT',
                body: data
            }),
            invalidatesTags: [TagType.Drivers]
        })
    })
})