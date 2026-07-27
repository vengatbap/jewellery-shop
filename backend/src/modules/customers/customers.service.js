"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const customers_repository_1 = require("./customers.repository");
class CustomerService {
    static async create(data) {
        return await customers_repository_1.CustomerRepository.create(data);
    }
}
exports.CustomerService = CustomerService;
