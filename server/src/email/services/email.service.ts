import { Injectable } from '@nestjs/common';

import { SendGridEmailService } from './sendgrid/sendgrid-email.service';

@Injectable()
export abstract class EmailService extends SendGridEmailService {}
