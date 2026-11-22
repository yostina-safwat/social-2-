import {App, cert, initializeApp, ServiceAccount} from 'firebase-admin/app';
import {getMessaging, Message} from 'firebase-admin/messaging';
import {INotificationProvider} from './notification.interface';

export class FirebaseProvider implements INotificationProvider {
    private readonly client: App;

    constructor(config: ServiceAccount) {
        this.client = initializeApp({
            credential: cert(config)
        });
    }

    async send(to: string, title: string, body: string): Promise<void> {
        const message: Message = {
            token: to,
            notification: {
                title,
                body
            }
        };
        await getMessaging(this.client).send(message);
    }
}
