import { pool } from "../../config/database"

export const createInventoryItem = async (data: any) => {
  const result = await pool.query(
    `
    INSERT INTO inventory (product_id, quantity, gross_weight, net_weight)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [data.productId, data.quantity, data.grossWeight, data.netWeight]
  )
  return result.rows[0]
}

export const getInventory = async () => {
  const result = await pool.query("SELECT * FROM inventory")
  return result.rows
}

export const getInventoryItem = async (id: string) => {
  const result = await pool.query(
    "SELECT * FROM inventory WHERE id = $1",
    [id]
  )
  return result.rows[0]
}