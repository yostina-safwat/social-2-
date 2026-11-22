import {readFileSync} from 'node:fs';
import {FirebaseProvider} from '../../pkg/notification/firebase';
import {ConsoleNotificationProvider} from '../../pkg/notification/console';
import {INotificationProvider} from '../../pkg/notification/notification.interface';
import {env} from '../config/env';

function createNotificationProvider(): INotificationProvider {
    if (!env.firebase.serviceAccountPath) {
        return new ConsoleNotificationProvider();
    }
    const serviceAccount = JSON.parse(readFileSync(env.firebase.serviceAccountPath, 'utf-8'));
    return new FirebaseProvider(serviceAccount);
}

export const notificationProvider = createNotificationProvider();
