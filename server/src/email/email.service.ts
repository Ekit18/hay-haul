import {IEmail} from "./interfaces/IEmail";
import {EmailResponseT} from "./types/EmailResponse.type";


export abstract class EmailService {
    abstract sendEmail(mail: IEmail): Promise<EmailResponseT>;
}