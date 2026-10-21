
import "dotenv/config";
import pg from "pg";

// Pool administra y reutiliza las conexiones a PostgreSQL.
const { Pool } = pg;

export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
