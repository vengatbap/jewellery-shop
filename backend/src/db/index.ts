import fs from "fs"
import path from "path"
import { Pool } from "pg"
import { env } from "../config/env"

const pool = new Pool({
  connectionString: env.DATABASE_URL
})

export async function runMigrations() {

  const migrationsPath = path.join(__dirname, "migrations")

  const files = fs
    .readdirSync(migrationsPath)
    .filter(f => f.endsWith(".sql"))
    .sort()

  for (const file of files) {

    const sql = fs.readFileSync(
      path.join(migrationsPath, file),
      "utf8"
    )

    console.log(`Running migration: ${file}`)

    await pool.query(sql)
  }

  console.log("All migrations executed")

}