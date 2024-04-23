import { CreateTransportValues } from '@/components/transport/modals/create-transport/validation';
import { api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export const transportApi = api.injectEndpoints({
    endpoints: (build) => ({
        createTransport: build.mutation<void, CreateTransportValues>({
            query: ({ carrierId, ...body }) => ({
                url: generatePath('/transport/carrier/:carrierId', { carrierId }),
                method: 'POST',
                body
            })
        }),
    })
})