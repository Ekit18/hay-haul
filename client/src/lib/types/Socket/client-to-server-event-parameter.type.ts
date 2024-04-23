import { ClientToServerEventName } from '@/lib/enums/client-to-server-event-name.enum';

type ClientToServerEventParameter = {
  [ClientToServerEventName.BASE_EVENT]: (payload: unknown) => void;
  [ClientToServerEventName.JOIN_PRODUCT_AUCTION_ROOMS]: (payload: string[]) => void;
  [ClientToServerEventName.JOIN_DELIVERY_ORDER_ROOMS]: (payload: string[]) => void;
};
export { type ClientToServerEventParameter };
