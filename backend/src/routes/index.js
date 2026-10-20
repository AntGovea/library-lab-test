
import {pool} from "../database/config.js";
import booksRouter from "./book.routes.js";

export class Routes {
    static configure(app) {
        // Comprueba que Express esté respondiendo.
        app.get("/health", (req, res) => {
            res.status(200).json({
                status: "ok",
                message: "API funcionando",
            });
        });

        // Comprueba que PostgreSQL responda.
        app.get("/ready", async (req, res) => {
            try {
                await pool.query("SELECT 1");

                res.status(200).json({
                    status: "ready",
                    database: "connected",
                });
            } catch (error) {
                res.status(503).json({
                    status: "not_ready",
                    database: "unavailable",
                });
            }
        });

        // Registra todas las rutas del CRUD de libros.
        app.use("/api/books", booksRouter);
    }
}
