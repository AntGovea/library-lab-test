
import { Router } from "express";
import { bookController } from "../controllers/book.controller.js";

// Creamos un router para organizar las rutas de libros.
const router = Router();

// GET /api/books
// Obtener todos los libros o buscar con ?search=...
router.get("/", bookController.getAll);

// GET /api/books/:id
// Obtener un libro por su ID, por ejemplo A12.
router.get("/:id", bookController.getById);

// POST /api/books
// Crear un libro nuevo.
router.post("/", bookController.create);

// PUT /api/books/:id
// Actualizar un libro existente.
router.put("/:id", bookController.update);

// DELETE /api/books/:id
// Eliminar un libro.
router.delete("/:id", bookController.delete);

// POST /api/books/:id/purchase
// Comprar una cantidad de ejemplares y registrar la venta.
router.post("/:id/purchase", bookController.purchase);

// Exportamos las rutas para utilizarlas en app.js.
export default router;
