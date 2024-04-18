import {Global, Module} from "@nestjs/common";
import {SendGridEmailService} from "./implementations/sendgrid-email/sendgrid-email.service";
import {ConfigService} from "@nestjs/config";
import {MailService} from "@sendgrid/mail";
import {SendgridEmailProvider} from "./implementations/sendgrid-email/sendgrid-email.provider";

@Global()
@Module({
  providers: [SendGridEmailService,
    SendgridEmailProvider,
    {
    provide: MailService,
    useFactory: (configService: ConfigService): MailService => {
      const mail = new MailService();
      mail.setApiKey(configService.get<string>('SENDGRID_API_KEY'));

      return mail;
    },
    inject: [ConfigService],
  }],
  exports: [SendGridEmailService,MailService,SendgridEmailProvider],
})
export class EmailModule {}
