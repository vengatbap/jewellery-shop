"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customers_service_1 = require("./customers.service");
const api_response_1 = require("../../utils/api-response");
class CustomerController {
    static async createCustomer(req, res) {
        const customer = await customers_service_1.CustomerService.create(req.body);
        return api_response_1.ApiResponse.success(res, customer);
    }
}
exports.CustomerController = CustomerController;
