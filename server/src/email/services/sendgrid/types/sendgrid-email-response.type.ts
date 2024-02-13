import { ClientResponse } from '@sendgrid/mail';

export type SendGridEmailResponse = [ClientResponse, Record<string, never>];
