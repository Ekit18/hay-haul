import { ClientToServerEventName } from 'src/lib/enums/client-to-server-event-name.enum';

type ClientToServerEventParameter = {
  [ClientToServerEventName.BASE_EVENT]: (payload: unknown) => void;
  [ClientToServerEventName.JOIN_PRODUCT_AUCTION_ROOMS]: (
    payload: string[],
  ) => void;
};
export { type ClientToServerEventParameter };
