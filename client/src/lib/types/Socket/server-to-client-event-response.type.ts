import { ClientToServerEventName } from '@/lib/enums/client-to-server-event-name.enum';
import { ServerToClientResponseStatus } from '@/lib/enums/server-to-client-response.status.enum';
import { SocketErrorMessage } from '@/lib/enums/socket-error-message.enum';
import { ValueOf } from '../types';

type ServerToClientEventResponse = Record<
  keyof ClientToServerEventName,
  { status: ValueOf<typeof ServerToClientResponseStatus>; message?: ValueOf<typeof SocketErrorMessage> }
>;
//     {
//   //   [ClientToServerEventName.START_SHIFT]: {
//   //     status: ValueOf<typeof ServerToClientResponseStatus>;
//   //     message?: SocketErrorValues;
//   //   };
//   //   [ClientToServerEventName.AUTHORIZE_DRIVER]: {
//   //     status: ValueOf<typeof ServerToClientResponseStatus>;
//   //     message?: SocketErrorValues;
//   //   };
// };

export { type ServerToClientEventResponse };
