import {EmailService} from "../../email.service";
import {SendGridEmailService} from "./sendgrid-email.service";

export const SendgridEmailProvider = {
    provide:EmailService,
    useClass:SendGridEmailService
}