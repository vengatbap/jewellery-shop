"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = runMigrations;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pg_1 = require("pg");
const env_1 = require("../config/env");
const pool = new pg_1.Pool({
    connectionString: env_1.env.DATABASE_URL
});
async function runMigrations() {
    const migrationsPath = path_1.default.join(__dirname, "migrations");
    const files = fs_1.default
        .readdirSync(migrationsPath)
        .filter(f => f.endsWith(".sql"))
        .sort();
    for (const file of files) {
        const sql = fs_1.default.readFileSync(path_1.default.join(migrationsPath, file), "utf8");
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
    }
    console.log("All migrations executed");
}
