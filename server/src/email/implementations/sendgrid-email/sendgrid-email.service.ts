import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {MailService} from "@sendgrid/mail";
import {EmailService} from "../../email.service";
import {EmailResponseT} from "../../types/EmailResponse.type";
import {IEmail} from "../../interfaces/IEmail";
import {EmailErrorMessage} from "../../enums/email-error-message.enum";

@Injectable()
export class SendGridEmailService
    implements EmailService
{
    private readonly fromEmail = this.configService.get<string>(
        'SENDGRID_FROM_EMAIL',
    );

    constructor(
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
    ) {}

    async sendEmail(mail: IEmail): Promise<EmailResponseT> {
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
