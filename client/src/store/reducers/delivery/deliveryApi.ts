import { CreateDeliveryFormValues } from '@/components/deliveries/modals/create-delivery/validation';
import { TagType, api } from '@/store/api';

export const deliveryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createDelivery: builder.mutation<void, CreateDeliveryFormValues>({
            query: (body) => ({
                url: 'delivery',
                method: 'POST',
                body,
            }),
            invalidatesTags: [TagType.Delivery]
        })
    })
})