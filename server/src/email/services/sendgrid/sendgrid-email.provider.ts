import { ConfigService } from '@nestjs/config';

import { MailService } from '@sendgrid/mail';

export const SendGridProvider = {
  provide: MailService,
  useFactory: (configService: ConfigService): MailService => {
    const mail = new MailService();
    mail.setApiKey(configService.get<string>('SENDGRID_API_KEY'));

    return mail;
  },
  inject: [ConfigService],
};
