import { pool } from "../../../config/database"

export class StockEngine {

  static async validateStock(productId: string, qty: number) {

    const result = await pool.query(
      `SELECT quantity FROM inventory WHERE product_id=$1`,
      [productId]
    )

    if (!result.rows.length)
      throw new Error("Product not found in inventory")

    const stock = result.rows[0].quantity

    if (stock < qty)
      throw new Error("Insufficient stock")

    return true
  }

  static async deductStock(productId: string, qty: number) {

    await pool.query(
      `
      UPDATE inventory
      SET quantity = quantity - $1
      WHERE product_id = $2
      `,
      [qty, productId]
    )
  }
}