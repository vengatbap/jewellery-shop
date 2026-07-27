export class Registry {
    private static services = new Map<string, any>();

    static register(name: string, service: any): void {
        console.log(`🔌 [Registry] Registered service: ${name}`);
        this.services.set(name, service);
    }

    static get<T>(name: string): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`[Registry] Service not registered: ${name}`);
        }
        return service as T;
    }

    static has(name: string): boolean {
        return this.services.has(name);
    }

    static clear(): void {
        this.services.clear();
    }
}
