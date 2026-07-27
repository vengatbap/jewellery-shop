export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH' | 'IN_APP';

export interface SendNotificationOptions {
    to: string;
    channel: NotificationChannel;
    subject?: string;
    body: string;
    metadata?: Record<string, any>;
}

export interface NotificationProvider {
    send(options: SendNotificationOptions): Promise<void>;
}

export class ConsoleNotificationProvider implements NotificationProvider {
    async send(options: SendNotificationOptions): Promise<void> {
        console.log(`🔔 [ConsoleNotification] Deliver via ${options.channel} to ${options.to}`);
        if (options.subject) {
            console.log(`Subject: ${options.subject}`);
        }
        console.log(`Body: ${options.body}`);
        if (options.metadata) {
            console.log(`Metadata: ${JSON.stringify(options.metadata)}`);
        }
    }
}

export function getNotificationProvider(): NotificationProvider {
    return new ConsoleNotificationProvider();
}
