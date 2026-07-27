"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const database_1 = require("../../config/database");
class CustomerRepository {
    static async create(data) {
        const query = `
    INSERT INTO customers(name,phone,email)
    VALUES($1,$2,$3)
    RETURNING *
    `;
        const values = [
            data.name,
            data.phone,
            data.email
        ];
        const result = await database_1.pool.query(query, values);
        return result.rows[0];
    }
}
exports.CustomerRepository = CustomerRepository;
