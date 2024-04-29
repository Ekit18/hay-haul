import { DeliveryStatus } from '@/lib/types/Delivery/Delivery.type';
import { ValueOf } from '@/lib/types/types';

export type DeliveryCardStatusType = {
    [K in ValueOf<typeof DeliveryStatus> as `${`${null}` | ValueOf<typeof DeliveryStatus>}`]: string;
};

export const deliveryCardStatus: DeliveryCardStatusType = {
    'null': 'bg-gray-400 text-white hover:brightness-95 hover:bg-gray-400',
    [DeliveryStatus.AwaitingDriver]: 'bg-purple-400 text-white hover:brightness-95 hover:bg-purple-400',
    [DeliveryStatus.AtFarmerFacility]: 'bg-gray-400 text-white hover:brightness-95 hover:bg-gray-400',
    [DeliveryStatus.Loading]: 'bg-yellow-500 text-black hover:brightness-95 hover:bg-yellow-500',
    [DeliveryStatus.OnTheWay]: 'bg-green-500 text-white hover:brightness-95 hover:bg-green-500',
    [DeliveryStatus.Unloading]: 'bg-yellow-500 text-black hover:brightness-95 hover:bg-yellow-500',
    [DeliveryStatus.AtBusinessFacility]: 'bg-green-400 text-white hover:brightness-95 hover:bg-green-400',
    [DeliveryStatus.Finished]: 'bg-blue-500 text-white hover:brightness-95 hover:bg-blue-500'
};

export const deliveryStatusToReadableMap: DeliveryCardStatusType = {
    'null': 'Not started',
    [DeliveryStatus.AwaitingDriver]: 'Awaiting driver',
    [DeliveryStatus.Unloading]: 'Unloading',
    [DeliveryStatus.Loading]: 'Loading',
    [DeliveryStatus.OnTheWay]: 'On the way',
    [DeliveryStatus.AtBusinessFacility]: 'At business facility',
    [DeliveryStatus.AtFarmerFacility]: 'At farmer facility',
    [DeliveryStatus.Finished]: 'Finished'
}