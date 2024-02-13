import { EmailService } from './services/email.service';
import { SendGridEmailService } from './services/sendgrid/sendgrid-email.service';

export const EmailProvider = {
  provide: EmailService,
  useExisting: SendGridEmailService,
};
