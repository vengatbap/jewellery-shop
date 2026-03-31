import { PricingEngine } from "./pricing.engine"
import { StockEngine } from "./stock.engine"

export class InvoiceEngine {

  static async generateInvoice(data: any, goldRate: number) {

    let subtotal = 0

    const processedItems = []

    for (const item of data.items) {

      await StockEngine.validateStock(
        item.productId,
        item.quantity
      )

      const price =
        PricingEngine.calculateItemPrice(
          item,
          goldRate
        )

      subtotal += price.total

      processedItems.push({
        ...item,
        ...price
      })
    }

    const tax = subtotal * 0.03

    const discount = data.discount || 0

    const total = subtotal + tax - discount

    return {
      subtotal,
      tax,
      discount,
      total,
      items: processedItems
    }
  }
}