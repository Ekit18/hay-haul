import { toast } from '@/components/ui/use-toast';

import { setSocketStatus } from '@/store/reducers/socket/socket-actions';
import { AppStore } from '@/store/store';
import { io, type Socket } from 'socket.io-client';
import { ClientToServerEventName } from '../enums/client-to-server-event-name.enum';
import { ServerToClientEventName } from '../enums/server-to-client-event-name.enum';
import { SocketStatus } from '../enums/socket-status.enum';
import { ClientToServerEventParameter } from '../types/Socket/client-to-server-event-parameter.type';
import { ServerToClientEventParameter } from '../types/Socket/server-to-client-event-parameter.type';
import { FirstParameter } from '../types/types';

class SocketService {
  private io!: Socket<ServerToClientEventParameter, ClientToServerEventParameter> | null;

  private baseUrl = import.meta.env.VITE_API_URL;

  public hasListeners<T extends keyof ServerToClientEventParameter = keyof ServerToClientEventParameter>(
    event: T
  ): boolean {
    return this.io ? this.io.hasListeners(event) : false;
  }

  public initializeStoreState(store: AppStore): void {
    if (!this.io) {
      return;
    }

    this.io.on('disconnect', () => {
      store.dispatch(setSocketStatus(SocketStatus.DISCONNECTED));
    });
    this.io.on('connect', () => {
      store.dispatch(setSocketStatus(SocketStatus.CONNECTED));
    });
  }

  public connect(token: string): void {
    if (!this.io) {
      if (!this.baseUrl) {
        throw new Error('Socket API URL is missing');
      }

      this.io = io(this.baseUrl, {
        transports: ['websocket', 'polling'],
        auth: {
          token: `Bearer ${token}`
        }
      });
      this.io.on('connect_error', async (err) => {
        toast({
          variant: 'destructive',
          title: 'Something went wrong',
          description: err?.message || ''
        });
      });
    }
  }

  public reconnect(token: string): void {
    if (!this.baseUrl) {
      throw new Error('Socket API URL is missing');
    }
    this.io = io(this.baseUrl, {
      transports: ['websocket', 'polling'],
      auth: {
        token: `Bearer ${token}`
      }
    });
  }

  public checkIsConnected(): boolean {
    return this.io?.connected ?? false;
  }

  public addListener<T extends keyof ServerToClientEventParameter = keyof ServerToClientEventParameter>(
    event: T,
    listener: ServerToClientEventParameter[T]
  ): void {
    this.io?.on(
      event as typeof ServerToClientEventName.BaseEvent,
      listener as ServerToClientEventParameter[typeof ServerToClientEventName.BaseEvent]
    );
  }

  public removeAllListeners<T extends keyof ServerToClientEventParameter = keyof ServerToClientEventParameter>(
    event?: T | undefined
  ): void {
    this.io?.removeAllListeners(event);
  }

  public emit<T extends keyof ClientToServerEventParameter = keyof ClientToServerEventParameter>({
    event,
    eventPayload
  }: {
    event: T;
    eventPayload?: FirstParameter<ClientToServerEventParameter[T]>;
  }): void {
    this.io?.emit(event as typeof ClientToServerEventName.BASE_EVENT, eventPayload);
  }

  public disconnect(): void {
    this.io?.disconnect();
    this.io = null;
  }

  public getInstance(): Socket<ServerToClientEventParameter, ClientToServerEventParameter> | null {
    return this.io;
  }

  // public emitWithAck<
  //   T extends keyof ClientToServerEventParameter = keyof ClientToServerEventParameter,
  //   R extends keyof ServerToClientEventResponse = Extract<T, keyof ServerToClientEventResponse>
  // >({
  //   event,
  //   eventPayload
  // }: {
  //   event: T;
  //   eventPayload?: FirstParameter<ClientToServerEventParameter[T]>;
  // }): Promise<ServerToClientEventResponse[R]> | undefined {
  //   return this.io?.emitWithAck(event as typeof ClientToServerEventName.BASE_EVENT, eventPayload);
  // }
}

export const socket = new SocketService();
