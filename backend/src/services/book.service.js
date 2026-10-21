import { bookRepository } from "../repositories/book.repository.js";
import { generateBookId } from "../utils/generate-book-id.js";
import { HttpError } from "../utils/http-error.js";

// Campos que la API permite recibir y modificar.
// El ID se genera automáticamente en el backend.
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
    "stock_quantity",
    "image_url"
];

// Valida los datos antes de enviarlos a PostgreSQL.
function validateBook(payload, creating = false) {
    if (
        !payload ||
        typeof payload !== "object" ||
        Array.isArray(payload)
    ) {
        throw new HttpError(400, "El body debe ser un objeto JSON.");
    }

    const fields = {};

    // Solo aceptamos propiedades permitidas.
    for (const key of Object.keys(payload)) {
        if (allowedFields.includes(key)) {
            fields[key] = payload[key];
        }
    }

    // Campos obligatorios al crear un libro.
    if (creating) {
        for (const key of ["title", "author", "genre", "price"]) {
            if (fields[key] === undefined || fields[key] === null) {
                throw new HttpError(
                    400,
                    `El campo ${key} es obligatorio.`
                );
            }
        }
    }

    if (Object.keys(fields).length === 0) {
        throw new HttpError(400, "Debes enviar campos válidos.");
    }

    // Validar textos obligatorios.
    for (const key of ["title", "author", "genre"]) {
        if (fields[key] !== undefined) {
            if (
                typeof fields[key] !== "string" ||
                !fields[key].trim()
            ) {
                throw new HttpError(
                    400,
                    `El campo ${key} no puede estar vacío.`
                );
            }

            fields[key] = fields[key].trim();
        }
    }

    // Convertir cadenas vacías opcionales a null.
    for (const key of [
        "isbn",
        "publisher",
        "description",
        "language",
        "image_url"
    ]) {
        if (fields[key] === "") {
            fields[key] = null;
        }
    }

    // Validar precio.
    if (fields.price !== undefined) {
        if (
            typeof fields.price !== "number" ||
            !Number.isFinite(fields.price) ||
            fields.price <= 0
        ) {
            throw new HttpError(
                400,
                "El precio debe ser un número mayor que cero."
            );
        }
    }

    // Validar números enteros.
    for (const key of [
        "publication_year",
        "pages",
        "stock_quantity"
    ]) {
        if (
            fields[key] !== undefined &&
            fields[key] !== null &&
            !Number.isInteger(fields[key])
        ) {
            throw new HttpError(
                400,
                `${key} debe ser un número entero.`
            );
        }
    }

    // Validar año de publicación.
    if (
        fields.publication_year !== undefined &&
        fields.publication_year !== null &&
        (
            fields.publication_year < 1000 ||
            fields.publication_year > 2100
        )
    ) {
        throw new HttpError(
            400,
            "El año debe estar entre 1000 y 2100."
        );
    }

    // Validar páginas.
    if (
        fields.pages !== undefined &&
        fields.pages !== null &&
        fields.pages <= 0
    ) {
        throw new HttpError(
            400,
            "Las páginas deben ser mayores que cero."
        );
    }

    // Validar inventario.
    if (
        fields.stock_quantity !== undefined &&
        fields.stock_quantity !== null &&
        fields.stock_quantity < 0
    ) {
        throw new HttpError(
            400,
            "El inventario no puede ser negativo."
        );
    }

    // Validar URL de imagen si se proporciona.
    if (
        fields.image_url !== undefined &&
        fields.image_url !== null &&
        (
            typeof fields.image_url !== "string" ||
            !fields.image_url.trim()
        )
    ) {
        throw new HttpError(
            400,
            "La URL de la imagen debe ser un texto válido."
        );
    }

    if (typeof fields.image_url === "string") {
        fields.image_url = fields.image_url.trim();
    }

    return fields;
}

export const bookService = {
    // Obtener todos los libros o buscar por término.
    async getAll(search) {
        return bookRepository.findAll(search);
    },

    // Obtener un libro por ID.
    async getById(id) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(
                400,
                "El ID debe tener formato A00."
            );
        }

        const book = await bookRepository.findById(id);

        if (!book) {
            throw new HttpError(404, "Libro no encontrado.");
        }

        return book;
    },

    // Crear un libro.
    async create(payload) {
        const fields = validateBook(payload, true);

        // Reintentar si se genera un ID que ya existe.
        for (let attempt = 0; attempt < 10; attempt++) {
            const book = {
                ...fields,
                id: generateBookId(),
                isbn: fields.isbn ?? null,
                publisher: fields.publisher ?? null,
                publication_year: fields.publication_year ?? null,
                description: fields.description ?? null,
                pages: fields.pages ?? null,
                language: fields.language ?? null,
                image_url: fields.image_url ?? null,
                stock_quantity: fields.stock_quantity ?? 0
            };

            try {
                return await bookRepository.create(book);
            } catch (error) {
                if (
                    error.code === "23505" &&
                    error.constraint === "books_pkey"
                ) {
                    continue;
                }

                throw error;
            }
        }

        throw new HttpError(
            503,
            "No se pudo generar un ID disponible. Inténtalo de nuevo."
        );
    },

    // Actualizar un libro.
    async update(id, payload) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(
                400,
                "El ID debe tener formato A00."
            );
        }

        const fields = validateBook(payload);
        const book = await bookRepository.update(id, fields);

        if (!book) {
            throw new HttpError(404, "Libro no encontrado.");
        }

        return book;
    },

    // Eliminar un libro.
    async delete(id) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(
                400,
                "El ID debe tener formato A00."
            );
        }

        const deleted = await bookRepository.delete(id);

        if (!deleted) {
            throw new HttpError(404, "Libro no encontrado.");
        }

        return deleted;
    },

    // Registrar una compra y actualizar el inventario.
    async purchase(id, payload) {
        if (!/^[A-Z][0-9]{2}$/.test(id)) {
            throw new HttpError(
                400,
                "El ID debe tener formato A00."
            );
        }

        const quantity = payload?.quantity ?? 1;

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new HttpError(
                400,
                "La cantidad debe ser un entero mayor que cero."
            );
        }

        return bookRepository.purchase(id, quantity);
    }
};