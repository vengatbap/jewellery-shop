"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryItem = exports.getInventory = exports.createInventoryItem = void 0;
const database_1 = require("../../config/database");
const createInventoryItem = async (data) => {
    const result = await database_1.pool.query(`
    INSERT INTO inventory (product_id, quantity, gross_weight, net_weight)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `, [data.productId, data.quantity, data.grossWeight, data.netWeight]);
    return result.rows[0];
};
exports.createInventoryItem = createInventoryItem;
const getInventory = async () => {
    const result = await database_1.pool.query("SELECT * FROM inventory");
    return result.rows;
};
exports.getInventory = getInventory;
const getInventoryItem = async (id) => {
    const result = await database_1.pool.query("SELECT * FROM inventory WHERE id = $1", [id]);
    return result.rows[0];
};
exports.getInventoryItem = getInventoryItem;
