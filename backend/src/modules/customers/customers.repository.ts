import { pool } from "../../config/database"

export class CustomerRepository {

  static async create(data: any) {

    const query = `
    INSERT INTO customers(name,phone,email)
    VALUES($1,$2,$3)
    RETURNING *
    `

    const values = [
      data.name,
      data.phone,
      data.email
    ]

    const result = await pool.query(query, values)

    return result.rows[0]

  }

}