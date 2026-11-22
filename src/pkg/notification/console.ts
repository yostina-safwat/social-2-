import {INotificationProvider} from './notification.interface';

export class ConsoleNotificationProvider implements INotificationProvider {
    async send(to: string, title: string, body: string): Promise<void> {
        console.log(`notification to ${to}: ${title} - ${body}`);
    }
}
