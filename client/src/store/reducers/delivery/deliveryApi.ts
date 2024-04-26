import { DeliveriesFilterFormValues } from '@/components/deliveries/deliveries-filter/validation';
import { CreateDeliveryFormValues } from '@/components/deliveries/modals/create-delivery/validation';
import { UpdateDeliveryFormValues } from '@/components/deliveries/modals/update-delivery/validation';
import { Delivery } from '@/lib/types/Delivery/Delivery.type';
import { DataWithCount } from '@/lib/types/types';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export const deliveryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDelivery: builder.mutation<void, CreateDeliveryFormValues>({
            query: (body) => ({
                url: 'delivery',
                method: 'POST',
                body,
            }),
            invalidatesTags: [TagType.Delivery]
        }),
        deleteDelivery: builder.mutation<void, string>({
            query: (id) => ({
                url: generatePath('delivery/:id', { id }),
                method: 'DELETE',
            }),
            invalidatesTags: [TagType.Delivery]
        }),
        getAllDeliveriesByCarrierId: builder.query<DataWithCount<Delivery>, URLSearchParams>({
            query: (searchParams) => ({
                url: 'delivery',
                method: 'GET',
                params: searchParams,
            }),
            providesTags: [TagType.Delivery]
        }),
        updateDelivery: builder.mutation<void, { id: string, body: UpdateDeliveryFormValues }>({
            query: ({ id, body }) => ({
                url: generatePath('delivery/:id', { id }),
                method: 'PATCH',
                body,
            }),
            invalidatesTags: [TagType.Delivery, TagType.Drivers]
        })
    })
})