"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEngine = void 0;
const pricing_engine_1 = require("./pricing.engine");
const stock_engine_1 = require("./stock.engine");
class InvoiceEngine {
    static async generateInvoice(data, goldRate) {
        let subtotal = 0;
        const processedItems = [];
        for (const item of data.items) {
            await stock_engine_1.StockEngine.validateStock(item.productId, item.quantity);
            const price = pricing_engine_1.PricingEngine.calculateItemPrice(item, goldRate);
            subtotal += price.total;
            processedItems.push({
                ...item,
                ...price
            });
        }
        const tax = subtotal * 0.03;
        const discount = data.discount || 0;
        const total = subtotal + tax - discount;
        return {
            subtotal,
            tax,
            discount,
            total,
            items: processedItems
        };
    }
}
exports.InvoiceEngine = InvoiceEngine;
