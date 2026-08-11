export class EcommerceClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getStores(orgId: string) {
        const response = await fetch(`${this.baseUrl}/api/v1/commerce/stores`, {
            headers: { 'x-organization-id': orgId }
        });
        if (!response.ok) throw new Error(`EcommerceClient error: ${response.statusText}`);
        return await response.json();
    }

    async addToCart(orgId: string, cartData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/commerce/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(cartData)
        });
        if (!response.ok) throw new Error(`EcommerceClient error: ${response.statusText}`);
        return await response.json();
    }

    async createOrder(orgId: string, orderData: any) {
        const response = await fetch(`${this.baseUrl}/api/v1/commerce/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-organization-id': orgId
            },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error(`EcommerceClient error: ${response.statusText}`);
        return await response.json();
    }
}
