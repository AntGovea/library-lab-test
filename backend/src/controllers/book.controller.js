
import { bookService } from "../services/book.service.js";

// El controller recibe las peticiones HTTP,
// llama al servicio correspondiente y devuelve la respuesta.
export const bookController = {

    // GET: obtener todos los libros o buscar por título, autor o género.
    async getAll(req, res, next) {
        try {
            // Leemos el parámetro opcional ?search=...
            const search = req.query.search ?? "";

            // Solicitamos los libros al servicio.
            const books = await bookService.getAll(search);

            // Respondemos con código 200 y los libros encontrados.
            res.status(200).json({
                success: true,
                data: books
            });
        } catch (error) {
            // Enviamos los errores al middleware centralizado.
            next(error);
        }
    },

    // GET: obtener un libro específico por su ID.
    async getById(req, res, next) {
        try {
            // El ID viene de la URL, por ejemplo /api/books/A12.
            const { id } = req.params;

            const book = await bookService.getById(id);

            res.status(200).json({
                success: true,
                data: book
            });
        } catch (error) {
            next(error);
        }
    },

    // POST: crear un libro nuevo.
    async create(req, res, next) {
        try {
            // req.body contiene los datos enviados en el JSON.
            const book = await bookService.create(req.body);

            // 201 indica que el recurso fue creado correctamente.
            res.status(201).json({
                success: true,
                message: "Libro creado correctamente.",
                data: book
            });
        } catch (error) {
            next(error);
        }
    },

    // PUT: actualizar un libro existente.
    async update(req, res, next) {
        try {
            const { id } = req.params;

            // Enviamos al servicio el ID y los campos recibidos.
            const book = await bookService.update(id, req.body);

            res.status(200).json({
                success: true,
                message: "Libro actualizado correctamente.",
                data: book
            });
        } catch (error) {
            next(error);
        }
    },

    // DELETE: eliminar un libro por su ID.
    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const deleted = await bookService.delete(id);

            res.status(200).json({
                success: true,
                message: "Libro eliminado correctamente.",
                data: deleted
            });
        } catch (error) {
            next(error);
        }
    },

    // POST: comprar una o varias unidades de un libro.
    async purchase(req, res, next) {
        try {
            const { id } = req.params;

            // El servicio valida la cantidad y el repositorio
            // registra la venta y descuenta el inventario.
            const sale = await bookService.purchase(id, req.body);

            res.status(200).json({
                success: true,
                message: "Compra realizada correctamente.",
                data: sale
            });
        } catch (error) {
            next(error);
        }
    }
};
