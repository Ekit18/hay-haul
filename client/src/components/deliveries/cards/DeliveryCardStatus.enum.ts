import { DeliveryStatus } from '@/lib/types/Delivery/Delivery.type';
import { ValueOf } from '@/lib/types/types';

export type DeliveryCardStatusType = {
    [K in ValueOf<typeof DeliveryStatus> as `${`${null}` | ValueOf<typeof DeliveryStatus>}`]: string;
};

export const deliveryCardStatus: DeliveryCardStatusType = {
    'null': 'bg-gray-400 text-white',
    [DeliveryStatus.AwaitingDriver]: 'bg-purple-400 text-white',
    [DeliveryStatus.AtFarmerFacility]: 'bg-gray-400 text-white',
    [DeliveryStatus.Loading]: 'bg-yellow-500 text-black',
    [DeliveryStatus.OnTheWay]: 'bg-green-500 text-white',
    [DeliveryStatus.Unloading]: 'bg-yellow-500 text-black',
    [DeliveryStatus.AtBusinessFacility]: 'bg-green-400 text-white',
};

export const deliveryStatusToReadableMap: DeliveryCardStatusType = {
    'null': 'Not started',
    [DeliveryStatus.AwaitingDriver]: 'Awaiting driver',
    [DeliveryStatus.Unloading]: 'Unloading',
    [DeliveryStatus.Loading]: 'Loading',
    [DeliveryStatus.OnTheWay]: 'On the way',
    [DeliveryStatus.AtBusinessFacility]: 'At business facility',
    [DeliveryStatus.AtFarmerFacility]: 'At farmer facility'
}