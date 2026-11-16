import {MailProvider} from "./mail.interface";

// development only: prints the email in the terminal instead of sending it
export class ConsoleMailProvider implements MailProvider {
    async send(email: string, subject: string, html: string): Promise<void> {
        console.log('----- email (not sent, MAIL_PROVIDER=console) -----');
        console.log(`to: ${email}`);
        console.log(`subject: ${subject}`);
        console.log(`body: ${html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}`);
        console.log('---------------------------------------------------');
    }
}
