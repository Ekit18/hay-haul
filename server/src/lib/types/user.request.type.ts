import { Request } from 'express';
import { Socket } from 'socket.io';
import { TokenPayload } from './token-payload.type';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export interface AuthenticatedSocket extends Socket {
  user?: TokenPayload;
}
