"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSService = void 0;
const database_1 = require("../../config/database");
const invoice_engine_1 = require("./engines/invoice.engine");
const stock_engine_1 = require("./engines/stock.engine");
class POSService {
    static async createInvoice(data) {
        const goldRateResult = await database_1.pool.query(`
      SELECT rate
      FROM metal_rates
      WHERE metal='gold'
      ORDER BY created_at DESC
      LIMIT 1
      `);
        const goldRate = goldRateResult.rows[0].rate;
        const invoice = await invoice_engine_1.InvoiceEngine.generateInvoice(data, goldRate);
        const result = await database_1.pool.query(`
      INSERT INTO invoices
      (customer_id,total)
      VALUES($1,$2)
      RETURNING id
      `, [
            data.customerId,
            invoice.total
        ]);
        const invoiceId = result.rows[0].id;
        for (const item of invoice.items) {
            await database_1.pool.query(`
        INSERT INTO invoice_items
        (invoice_id,product_id,price,quantity)
        VALUES($1,$2,$3,$4)
        `, [
                invoiceId,
                item.productId,
                item.total,
                item.quantity
            ]);
            await stock_engine_1.StockEngine.deductStock(item.productId, item.quantity);
        }
        return {
            invoiceId,
            ...invoice
        };
    }
}
exports.POSService = POSService;
