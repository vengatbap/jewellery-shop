import { DomainEvent } from './events.js';

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

    async emit<T extends DomainEvent>(eventTypeOrEvent: string | T, payload?: Record<string, unknown>): Promise<void> {
        let eventObj: DomainEvent;
        if (typeof eventTypeOrEvent === 'string') {
            eventObj = {
                type: eventTypeOrEvent,
                ...(payload || {}),
            } as DomainEvent;
        } else {
            eventObj = eventTypeOrEvent;
        }

        const handlers = this.handlers.get(eventObj.type);
        if (!handlers) {
            return;
        }

        const promises = Array.from(handlers).map((handler) =>
            handler(eventObj).catch((error) => {
                console.error(`Error in event handler for ${eventObj.type}:`, error);
            })
        );

        await Promise.all(promises);
    }

    private static singletonInstance: EventBus;

    static get instance(): EventBus {
        if (!EventBus.singletonInstance) {
            EventBus.singletonInstance = new EventBus();
        }
        return EventBus.singletonInstance;
    }

    static subscribe<T extends DomainEvent>(eventType: T['type'], handler: EventHandler<T>): () => void {
        return EventBus.instance.subscribe(eventType, handler);
    }

    static async emit<T extends DomainEvent>(eventTypeOrEvent: string | T, payload?: Record<string, unknown>): Promise<void> {
        return EventBus.instance.emit(eventTypeOrEvent, payload);
    }
}

export const eventBus = EventBus.instance;
