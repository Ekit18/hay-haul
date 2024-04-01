import { ServerToClientEventName } from 'src/lib/enums/server-to-client-event-name.enum';
import { NotificationMessage } from 'src/notification/enums/notification-message.enum';
import { ProductAuctionBid } from 'src/product-auction-bid/product-auction-bid.entity';
import { ProductAuction } from 'src/product-auction/product-auction.entity';

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
  }) => void;
  [ServerToClientEventName.BaseEvent]: (payload: unknown) => void;
  [ServerToClientEventName.Notification]: (
    payload: NotificationMessage,
  ) => void;
};
export { type ServerToClientEventParameter };
