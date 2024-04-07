import { ServerToClientEventName } from '@/lib/enums/server-to-client-event-name.enum';
import { Notification } from '../Notifications/Notifications.type';
import { ProductAuction } from '../ProductAuction/ProductAuction.type';
import { ProductAuctionBid } from '../ProductAuctionBid/ProductAuctionBid.type';

type ServerToClientEventParameter = {
  //   [ServerEventName.TRUCKS_LIST_UPDATE]: (payload: TruckEntityT[]) => void;
  //   [ServerEventName.TRUCK_CHOSEN]: (payload: TruckDataSocketPayload) => void;
  //   [ServerEventName.TRUCK_AVAILABLE]: (payload: TruckDataSocketPayload) => void;
  //   [ServerEventName.SHIFT_SYNC]: (payload: { truck: TruckEntityT }) => void;
  //   [ServerEventName.ERROR]: (payload: { message: string }) => void;
  //   [ServerEventName.DRIVER_TIMED_OUT]: (payload: null) => void;
  //   [ServerEventName.SHIFT_ENDED]: (payload: null) => void;
  //   [ServerEventName.BASE_EVENT]: (payload: unknown) => void;
  //   [ServerEventName.TRUCK_LOCATION_UPDATED]: (payload: { truckId: number; latLng: GeolocationLatLng }) => void;
  //   [ServerEventName.ORDER_UPDATED]: (order: OrderResponseDto) => void;
  //   [ServerEventName.ORDER_CREATED]: (order: OrderResponseDto) => void;
  [ServerToClientEventName.AuctionUpdated]: (payload: {
    auctionId: ProductAuction['id'];
    currentMaxBid: ProductAuctionBid['price'];
    currentMaxBidId: ProductAuction['currentMaxBidId'];
    currentMaxBidUserId: ProductAuctionBid['userId'];
    auctionStatus?: ProductAuction['auctionStatus'];
  }) => void;
  [ServerToClientEventName.BaseEvent]: (payload: unknown) => void;
  [ServerToClientEventName.Notification]: (payload: Notification) => void;
};
export { type ServerToClientEventParameter };
