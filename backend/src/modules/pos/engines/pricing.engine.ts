export class PricingEngine {

  static calculateItemPrice(item: any, goldRate: number) {

    const netWeight =
      item.netWeight ??
      (item.grossWeight - (item.stoneWeight || 0))

    const metalValue = netWeight * goldRate

    const wastage =
      (item.wastagePercent || 0) / 100 * metalValue

    const making =
      item.makingCharge || 0

    const total =
      metalValue + wastage + making

    return {
      netWeight,
      metalValue,
      wastage,
      making,
      total
    }
  }
}