import { CreateTransportValues } from '@/components/transport/modals/create-transport/validation';
import { UpdateTransportValues } from '@/components/transport/modals/update-transport/validation';
import { Transport } from '@/lib/types/Transport/Transport.type';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export type GetAllTransportsByCarrierIdDto = {
    carrierId: string;
    searchParams?: URLSearchParams | undefined;
}


export const transportApi = api.injectEndpoints({
    endpoints: (build) => ({
        createTransport: build.mutation<void, CreateTransportValues>({
            query: ({ carrierId, ...body }) => ({
                url: generatePath('/transport/carrier/:carrierId', { carrierId }),
                method: 'POST',
                body
            }),
            invalidatesTags: [TagType.Transport]
        }),
        getAllCarrierTransports: build.query<Transport[], GetAllTransportsByCarrierIdDto>({
            query: ({ carrierId, searchParams }) => ({
                url: generatePath('/transport/carrier/:carrierId', { carrierId }),
                method: 'GET',
                params: searchParams
            }),
            providesTags: [TagType.Transport]
        }),
        deleteTransport: build.mutation<void, string>({
            query: (id) => ({
                url: generatePath('/transport/:id', { id }),
                method: 'DELETE',

            }),
            invalidatesTags: [TagType.Transport]
        }),
        updateTransport: build.mutation<void, { id: string, data: Partial<UpdateTransportValues> }>({
            query: ({ id, data }) => ({
                url: generatePath('/transport/:id', { id }),
                method: 'PUT',
                body: data
            }),
            invalidatesTags: [TagType.Transport]
        })
    })
})