import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailService } from '@sendgrid/mail';

import { EmailErrorMessage } from 'src/email/enums/email-error-message.enum';
import { IEmailService } from 'src/email/interfaces/email-service.interface';
import { SendGridEmail } from './interfaces/sendgrid-email.interface';
import { SendGridEmailResponse } from './types/sendgrid-email-response.type';

@Injectable()
export class SendGridEmailService
  implements IEmailService<SendGridEmail, SendGridEmailResponse>
{
  private readonly fromEmail = this.configService.get<string>(
    'SENDGRID_FROM_EMAIL',
  );

  constructor(
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async sendEmail(mail: SendGridEmail): Promise<SendGridEmailResponse> {
    const transport = await this.mailService.send({
      ...mail,
      from: this.fromEmail,
    });

    if (transport[0].statusCode !== HttpStatus.ACCEPTED) {
      throw new HttpException(
        EmailErrorMessage.FailedSendEmail,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return transport;
  }
}
