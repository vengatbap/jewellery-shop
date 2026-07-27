"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockEngine = void 0;
const database_1 = require("../../../config/database");
class StockEngine {
    static async validateStock(productId, qty) {
        const result = await database_1.pool.query(`SELECT quantity FROM inventory WHERE product_id=$1`, [productId]);
        if (!result.rows.length)
            throw new Error("Product not found in inventory");
        const stock = result.rows[0].quantity;
        if (stock < qty)
            throw new Error("Insufficient stock");
        return true;
    }
    static async deductStock(productId, qty) {
        await database_1.pool.query(`
      UPDATE inventory
      SET quantity = quantity - $1
      WHERE product_id = $2
      `, [qty, productId]);
    }
}
exports.StockEngine = StockEngine;
