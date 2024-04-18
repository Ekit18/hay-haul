import { MailDataRequired } from '@sendgrid/mail';

//Will become more generic when new analogues of sendgrid are used.
//In that case, their common fields will be in this interface
export interface IEmail extends Omit<MailDataRequired, 'from'> {
    to: string | string[];
    templateId: string;
}
