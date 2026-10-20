
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./config.js";

// En ES Modules no existe __dirname por defecto.
// Lo reconstruimos a partir de la URL de este archivo.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSchema() {
    try {
        // Localiza y lee el archivo SQL.
        const schemaPath = path.join(__dirname, "schema.sql");
        const schema = await fs.readFile(schemaPath, "utf8");

        // Ejecuta las sentencias SQL en PostgreSQL.
        await pool.query(schema);

        console.log("Tablas creadas correctamente.");
    } catch (error) {
        console.error("Error al crear las tablas:", error.message);
        process.exitCode = 1;
    } finally {
        // Cierra las conexiones al finalizar el script.
        await pool.end();
    }
}

await runSchema();
