
import { pool } from "../database/config.js";
import booksRouter from "./book.routes.js";
import { apiDocumentation } from "./docs/apiDocumentation.js";

export class Routes {
  static configure(app) {
    // Comprueba que Express esté respondiendo.
    app.get("/health", (req, res) => {
      return res.status(200).json({
        status: "ok",
        message: "API funcionando",
      });
    });

    // Comprueba que PostgreSQL responda.
    app.get("/ready", async (req, res) => {
      try {
        await pool.query("SELECT 1");

        return res.status(200).json({
          status: "ready",
          database: "connected",
        });
      } catch (error) {
        console.error("La comprobación de PostgreSQL falló:", {
          message: error.message,
          code: error.code,
        });

        return res.status(503).json({
          status: "not_ready",
          database: "unavailable",
        });
      }
    });
    app.get("/api/docs", (req, res) => {
      res.status(200).json({
        data: apiDocumentation,
      });
    });
    // Rutas del CRUD de libros.
    app.use("/api/books", booksRouter);
  }
}
