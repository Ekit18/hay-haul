import { CreateDeliveryOfferValues } from '@/components/delivery-offer/modals/create-delivery-offer/validation';
import { DeliveryOffer } from '@/lib/types/DeliveryOffer/DeliveryOffer.type';
import { TagType, api } from '@/store/api';
import { generatePath } from 'react-router-dom';

export const deliveryOfferApi = api.injectEndpoints({
  endpoints: (build) => ({
    createDeliveryOffer: build.mutation<DeliveryOffer, CreateDeliveryOfferValues>({
      query: (data) => ({
        url: generatePath('delivery-offer/delivery-order/:deliveryOrderId', { deliveryOrderId: data.deliveryOrderId }),
        method: 'POST',
        body: { price: data.price }
      }),
      invalidatesTags: [TagType.DeliveryOrder, TagType.DeliveryOffer]
    })
    // updateDeliveryOffer: build.mutation({
    //   query: (data) => ({
    //     url: `delivery-offers/${data.id}`,
    //     method: 'PUT',
    //     body: data
    //   })
    // }),
    // deleteDeliveryOffer: build.mutation({
    //   query: (id) => ({
    //     url: `delivery-offers/${id}`,
    //     method: 'DELETE'
    //   })
    // })
  })
});
