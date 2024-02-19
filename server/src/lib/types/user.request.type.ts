import { Request } from 'express';
import { TokenPayload } from './token-payload.type';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}
