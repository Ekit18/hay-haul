import { DeliveryOrder } from '../DeliveryOrder/DeliveryOrder.type';
import { Driver } from '../Driver/Driver.type';
import { Timestamps } from '../Timestamps/Timestamps';
import { Transport } from '../Transport/Transport.type';
import { User } from '../User/User.type';
import { ValueOf } from '../types';

export const DeliveryStatus = {
    AwaitingDriver: 'AWAITING_DRIVER',
    AtFarmerFacility: 'AT_FARMER_FACILITY',
    Loading: 'LOADING',
    OnTheWay: 'ON_THE_WAY',
    Unloading: 'UNLOADING',
    AtBusinessFacility: 'AT_BUSINESS_FACILITY',
    Finished: 'Finished'
} as const

export type DeliveryStatusValues = ValueOf<typeof DeliveryStatus>

export type Delivery = Timestamps & {
    id: string;

    driverId: string;

    transportId: string;

    deliveryOrderId: string;

    carrierId: string;

    driver: Driver;

    transport: Transport;

    carrier: User;

    deliveryOrder: DeliveryOrder;

    status: DeliveryStatusValues;
}