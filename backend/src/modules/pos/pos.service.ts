import { pool } from "../../config/database"
import { InvoiceEngine } from "./engines/invoice.engine"
import { StockEngine } from "./engines/stock.engine"

export class POSService {

  static async createInvoice(data: any) {

    const goldRateResult = await pool.query(
      `
      SELECT rate
      FROM metal_rates
      WHERE metal='gold'
      ORDER BY created_at DESC
      LIMIT 1
      `
    )

    const goldRate = goldRateResult.rows[0].rate

    const invoice =
      await InvoiceEngine.generateInvoice(
        data,
        goldRate
      )

    const result = await pool.query(
      `
      INSERT INTO invoices
      (customer_id,total)
      VALUES($1,$2)
      RETURNING id
      `,
      [
        data.customerId,
        invoice.total
      ]
    )

    const invoiceId = result.rows[0].id

    for (const item of invoice.items) {

      await pool.query(
        `
        INSERT INTO invoice_items
        (invoice_id,product_id,price,quantity)
        VALUES($1,$2,$3,$4)
        `,
        [
          invoiceId,
          item.productId,
          item.total,
          item.quantity
        ]
      )

      await StockEngine.deductStock(
        item.productId,
        item.quantity
      )
    }

    return {
      invoiceId,
      ...invoice
    }
  }
}