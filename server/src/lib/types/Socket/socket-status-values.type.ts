import { SocketStatus } from 'src/lib/enums/socket-status.enum';
import { ValueOf } from '../types';

export type SocketStatusValues = ValueOf<typeof SocketStatus>;
