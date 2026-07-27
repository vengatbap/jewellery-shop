import { DomainEvent } from './events';

export type EventHandler<T extends DomainEvent = DomainEvent> = (
    event: T
) => Promise<void>;

export class EventBus {
    private handlers: Map<string, Set<EventHandler<any>>> = new Map();

    subscribe<T extends DomainEvent>(
        eventType: T['type'],
        handler: EventHandler<T>
    ): () => void {
        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, new Set());
        }

        const handlers = this.handlers.get(eventType)!;
        handlers.add(handler);

        // Return unsubscribe function
        return () => {
            handlers.delete(handler);
        };
    }

    async emit<T extends DomainEvent>(event: T): Promise<void> {
        const handlers = this.handlers.get(event.type);
        if (!handlers) {
            return;
        }

        const promises = Array.from(handlers).map((handler) =>
            handler(event).catch((error) => {
                console.error(`Error in event handler for ${event.type}:`, error);
            })
        );

        await Promise.all(promises);
    }
}

export const eventBus = new EventBus();
