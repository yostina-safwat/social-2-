export interface INotificationProvider {
    send(to: string, title: string, body: string): Promise<void>;
}
