import { Module } from '@nestjs/common';

import { EmailProvider } from './email.provider';
import { SendGridProvider } from './services/sendgrid/sendgrid-email.provider';
import { SendGridEmailService } from './services/sendgrid/sendgrid-email.service';

@Module({
  providers: [SendGridEmailService, SendGridProvider, EmailProvider],
  exports: [SendGridEmailService, EmailProvider],
})
export class EmailModule {}
