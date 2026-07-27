"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSController = void 0;
const pos_service_1 = require("./pos.service");
class POSController {
    static async createInvoice(req, res) {
        const invoice = await pos_service_1.POSService.createInvoice(req.body);
        res.json({
            success: true,
            data: invoice
        });
    }
}
exports.POSController = POSController;
