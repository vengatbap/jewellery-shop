import { eventBus } from '@auric-one/events';

export class EventPublisher {
    static async publishCatalogChanged(params: {
        entity: string;
        action: 'CREATE' | 'UPDATE' | 'DELETE';
        organizationId?: string;
        payload: Record<string, any>;
        userId?: string;
    }) {
        await eventBus.emit({
            type: 'CATALOG_CHANGED',
            entity: params.entity,
            action: params.action,
            organizationId: params.organizationId,
            payload: params.payload,
            timestamp: new Date(),
            userId: params.userId
        });
    }
}
