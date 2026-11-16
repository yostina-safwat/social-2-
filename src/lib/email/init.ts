import {MailjetProvider} from "../../pkg/email/mailjet";
import {env} from "../config/env";
import {NodemailerProvider} from "../../pkg/email/nodemailer";
import {ConsoleMailProvider} from "../../pkg/email/console";
import {MailProvider} from "../../pkg/email/mail.interface";

export const nodemailerProvider = new NodemailerProvider(env.nodemailer);

// Mailjet is optional: create it only when you set the MAILJET_* values in .env
export function createMailjetProvider(): MailjetProvider {
    return new MailjetProvider({
        apiKey: env.mailjet.apiKey,
        apiSecret: env.mailjet.apiSecret,
        fromEmail: env.mailjet.fromEmail,
        fromName: env.mailjet.fromName,
    });
}

// the provider used by the app: smtp (Gmail) or console (development)
export const mailProvider: MailProvider =
    env.mailProvider === 'console' ? new ConsoleMailProvider() : nodemailerProvider;
