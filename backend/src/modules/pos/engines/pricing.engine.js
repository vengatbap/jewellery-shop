"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingEngine = void 0;
class PricingEngine {
    static calculateItemPrice(item, goldRate) {
        const netWeight = item.netWeight ??
            (item.grossWeight - (item.stoneWeight || 0));
        const metalValue = netWeight * goldRate;
        const wastage = (item.wastagePercent || 0) / 100 * metalValue;
        const making = item.makingCharge || 0;
        const total = metalValue + wastage + making;
        return {
            netWeight,
            metalValue,
            wastage,
            making,
            total
        };
    }
}
exports.PricingEngine = PricingEngine;
