
import { bookRepository } from "../repositories/book.repository.js";
import { generateBookId } from "../utils/generate-book-id.js";
import { HttpError } from "../utils/http-error.js";

// Lista de propiedades que nuestra API permite recibir y modificar.
// No incluimos "id" porque lo genera el backend.
const allowedFields = [
    "title",
    "author",
    "genre",
    "isbn",
    "publisher",
    "publication_year",
    "description",
    "pages",
    "language",
    "price",
    "stock_quantity"
];

// Valida los datos recibidos antes de enviarlos a PostgreSQL.
// creating = true significa que estamos creando un libro nuevo.
function validateBook(payload, creating = false) {
    // El body debe ser un objeto JSON válido.
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
        throw new HttpError(400, "El body debe ser un objeto JSON.");
    }

    // Creamos un objeto vacío para guardar solo las propiedades permitidas.
    const fields = {};

    // Recorremos los nombres de las propiedades recibidas.
    for (const key of Object.keys(payload)) {
        // Comprobamos si nuestra API permite recibir esta propiedad.
        if (allowedFields.includes(key)) {
            // Copiamos el valor al objeto que vamos a validar.
            fields[key] = payload[key];
        }
    }

    // Para crear un libro exigimos estos cuatro campos.
    if (creating) {
        for (const key of ["title", "author", "genre", "price"]) {
            if (fields[key] === undefined || fields[key] === null) {
                throw new HttpError(400, `El campo ${key} es obligatorio.`);
            }
        }
    }

    // Si no recibimos ningún campo permitido, rechazamos la petición.
    if (Object.keys(fields).length === 0) {
        throw new HttpError(400, "Debes enviar campos válidos.");
    }

    // Validamos que título, autor y género sean textos no vacíos.
    for (const key of ["title", "author", "genre"]) {
        if (fields[key] !== undefined) {
            if (typeof fields[key] !== "string" || !fields[key].trim()) {
                throw new HttpError(400, `El campo ${key} no puede estar vacío.`);
            }

            // Eliminamos espacios sobrantes al inicio y al final.
            fields[key] = fields[key].trim();
        }
    }

    // Convertimos cadenas vacías de campos opcionales en null.
    for (const key of ["isbn", "publisher", "description", "language"]) {
        if (fields[key] === "") {
            fields[key] = null;
        }
    }

    // El precio debe ser un número válido mayor que cero.
    if (fields.price !== undefined) {
        if (
            typeof fields.price !== "number" ||
            !Number.isFinite(fields.price) ||
            fields.price <= 0
        ) {
            throw new HttpError(400, "El precio debe ser un número mayor que cero.");
        }
    }

    // Año, páginas e inventario deben ser números enteros.
    for (const key of ["publication_year", "pages", "stock_quantity"]) {
        if (fields[key] !== undefined && fields[key] !== null) {
            if (!Number.isInteger(fields[key])) {
                throw new HttpError(400, `${key} debe ser un número entero.`);
            }
        }
    }

    // Comprobamos que el año esté dentro del rango permitido.
    if (
        fields.publication_year !== undefined &&
        fields.publication_year !== null &&
        (fields.publication_year < 1000 || fields.publication_year > 2100)
    ) {
        throw new HttpError(400, "El año debe estar entre 1000 y 2100.");
    }

    // Si se especifican las páginas, deben ser mayores que cero.
    if (fields.pages !== undefined && fields.pages !== null && fields.pages <= 0) {
        throw new HttpError(400, "Las páginas deben ser mayores que cero.");
    }

    // El inventario no puede ser negativo.
    if (fields.stock_quantity !== undefined && fields.stock_quantity < 0) {
        throw new HttpError(400, "El inventario no puede ser negativo.");
    }

    // Devolvemos únicamente los campos permitidos y validados.
    return fields;
}

// El servicio contiene las reglas de negocio.
// El repositorio se encarga de ejecutar las consultas SQL.
export const bookService = {
    // Obtiene todos los libros o filtra por título, autor o género.
    async getAll(search) {
        return bookRepository.findAll(search);
    },

    // Busca un libro por su ID.
    async getById(id) {
        // El ID debe tener una letra mayúscula y dos dígitos.
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(400, "El ID debe tener formato A00.");
        }

        const book = await bookRepository.findById(id);

        // Si el ID es válido pero no existe, devolvemos un error 404.
        if (!book) {
            throw new HttpError(404, "Libro no encontrado.");
        }

        return book;
    },

    // Valida los datos, genera un ID e intenta crear el libro.
    async create(payload) {
        const fields = validateBook(payload, true);

        // Solo existen 2,600 IDs posibles: A00 hasta Z99.
        // Intentamos generar otro ID si el generado ya está ocupado.
        for (let attempt = 0; attempt < 10; attempt++) {
            const book = {
                ...fields,

                // El ID siempre lo genera el backend.
                id: generateBookId(),

                // Si un campo opcional no fue enviado, usamos null.
                isbn: fields.isbn ?? null,
                publisher: fields.publisher ?? null,
                publication_year: fields.publication_year ?? null,
                description: fields.description ?? null,
                pages: fields.pages ?? null,
                language: fields.language ?? null,

                // Si no indican existencias iniciales, comenzamos en cero.
                stock_quantity: fields.stock_quantity ?? 0
            };

            try {
                // El repositorio guarda el libro y devuelve el registro creado.
                return await bookRepository.create(book);
            } catch (error) {
                // PostgreSQL usa 23505 cuando se viola una restricción UNIQUE.
                // Solo reintentamos si la colisión fue en el ID principal.
                if (
                    error.code === "23505" &&
                    error.constraint === "books_pkey"
                ) {
                    continue;
                }

                // Por ejemplo, un ISBN duplicado no debe provocar otro ID.
                throw error;
            }
        }

        // Después de diez intentos fallidos, informamos que no fue posible.
        throw new HttpError(
            503,
            "No se pudo generar un ID disponible. Inténtalo de nuevo."
        );
    },

    // Actualiza un libro existente.
    async update(id, payload) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(400, "El ID debe tener formato A00.");
        }

        // En la actualización solo exigimos los campos que el usuario envíe.
        const fields = validateBook(payload);

        const book = await bookRepository.update(id, fields);

        if (!book) {
            throw new HttpError(404, "Libro no encontrado.");
        }

        return book;
    },

    // Elimina un libro si existe y la base de datos lo permite.
    async delete(id) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(400, "El ID debe tener formato A00.");
        }

        const deleted = await bookRepository.delete(id);

        if (!deleted) {
            throw new HttpError(404, "Libro no encontrado.");
        }

        return deleted;
    },

    // Coordina la compra; el repositorio maneja la transacción SQL.
    async purchase(id, payload) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(400, "El ID debe tener formato A00.");
        }

        // Si no indican cantidad, asumimos que quieren comprar una unidad.
        const quantity = payload?.quantity ?? 1;

        // La cantidad debe ser un entero positivo.
        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new HttpError(
                400,
                "La cantidad debe ser un entero mayor que cero."
            );
        }

        // El repositorio registra la venta y descuenta el inventario.
        return bookRepository.purchase(id, quantity);
    }
};
