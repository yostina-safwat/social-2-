import {MailjetProvider} from "../../pkg/email/mailjet";
import {env} from "../config/env";
import {NodemailerProvider} from "../../pkg/email/nodemailer";

// default provider used to send emails (Gmail SMTP)
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
