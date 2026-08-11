export interface CalculationInputItem {
    netWeightGrams: number;
    metalRatePerGram: number;
    stoneValue?: number;
    makingCharge?: number;
    makingChargeType?: 'FIXED' | 'PER_GRAM';
    wastagePercentage?: number;
    discountAmount?: number;
    taxRatePercentage?: number;
}

export class PricingEngine {
    static calculateLineItem(item: CalculationInputItem) {
        const netWeight = item.netWeightGrams || 0;
        const metalRate = item.metalRatePerGram || 0;
        const stoneVal = item.stoneValue || 0;
        const rawMakingCharge = item.makingCharge || 0;
        const makingChargeType = item.makingChargeType || 'FIXED';
        const wastagePct = item.wastagePercentage || 0;
        const discount = item.discountAmount || 0;
        const taxRate = item.taxRatePercentage !== undefined ? item.taxRatePercentage : 10.0; // Default 10% VAT

        const metalValue = netWeight * metalRate;
        const makingCharge = makingChargeType === 'PER_GRAM' ? rawMakingCharge * netWeight : rawMakingCharge;
        const wastageValue = netWeight * (wastagePct / 100.0) * metalRate;
        const subtotalBeforeDiscount = metalValue + stoneVal + makingCharge + wastageValue;
        const taxableAmount = Math.max(0, subtotalBeforeDiscount - discount);
        const taxAmount = taxableAmount * (taxRate / 100.0);
        const totalPrice = taxableAmount + taxAmount;

        const round2 = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

        return {
            metalValue: round2(metalValue),
            stoneValue: round2(stoneVal),
            makingCharge: round2(makingCharge),
            wastageValue: round2(wastageValue),
            discountAmount: round2(discount),
            taxAmount: round2(taxAmount),
            totalPrice: round2(totalPrice),
        };
    }
}
