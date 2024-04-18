import { ClientResponse } from '@sendgrid/mail';

//Will become more generic when new analogues of sendgrid are used.
//In that case, their common fields will be in this type
export type EmailResponseT = [ClientResponse, Record<string, never>];
