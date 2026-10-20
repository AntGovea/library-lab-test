// src/repositories/book.repository.js

import { pool } from "../database/config.js";

// Consultas a PostgreSQL: aquí no manejamos peticiones HTTP.
export const bookRepository = {
    // Devuelve todos los libros o filtra por título, autor o género.
    async findAll(search = "") {
        const query = `
            SELECT *
            FROM books
            WHERE
                $1 = ''
                OR title ILIKE $2
                OR author ILIKE $2
                OR genre ILIKE $2
            ORDER BY title ASC
        `;

        const result = await pool.query(query, [
            search,
            `%${search}%`
        ]);

        return result.rows;
    },

    // Busca un libro por su clave primaria.
    async findById(id) {
        const result = await pool.query(
            "SELECT * FROM books WHERE id = $1",
            [id]
        );

        return result.rows[0] ?? null;
    },

    // Inserta un libro usando parámetros para evitar inyección SQL.
    async create(book) {
        const query = `
            INSERT INTO books (
                id, title, author, genre, isbn, publisher,
                publication_year, description, pages, language,
                price, stock_quantity
            )
            VALUES (
                $1, $2, $3, $4, $5, $6,
                $7, $8, $9, $10, $11, $12
            )
            RETURNING *
        `;

        const values = [
            book.id,
            book.title,
            book.author,
            book.genre,
            book.isbn,
            book.publisher,
            book.publication_year,
            book.description,
            book.pages,
            book.language,
            book.price,
            book.stock_quantity
        ];

        const result = await pool.query(query, values);

        return result.rows[0];
    },

    // Actualiza solamente los campos permitidos que fueron enviados.
    async update(id, fields) {
        const columns = {
            title: "title",
            author: "author",
            genre: "genre",
            isbn: "isbn",
            publisher: "publisher",
            publication_year: "publication_year",
            description: "description",
            pages: "pages",
            language: "language",
            price: "price",
            stock_quantity: "stock_quantity"
        };

        const entries = Object.entries(fields).filter(
            ([key]) => Object.hasOwn(columns, key)
        );

        if (entries.length === 0) {
            return this.findById(id);
        }

        // Los nombres de columna salen de nuestra lista permitida.
        // Los valores siguen usando parámetros SQL.
        const assignments = entries.map(
            ([key], index) => `${columns[key]} = $${index + 2}`
        );

        const values = [
            id,
            ...entries.map(([, value]) => value)
        ];

        const query = `
            UPDATE books
            SET ${assignments.join(", ")},
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;

        const result = await pool.query(query, values);

        return result.rows[0] ?? null;
    },

    // Elimina el libro. La base de datos protegerá el historial de ventas.
    async delete(id) {
        const result = await pool.query(
            "DELETE FROM books WHERE id = $1 RETURNING id",
            [id]
        );

        return result.rows[0] ?? null;
    },

    // Registra una compra y descuenta inventario en una sola transacción.
    async purchase(id, quantity) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            // El descuento ocurre solo si existe stock suficiente.
            const stockResult = await client.query(
                `UPDATE books
                 SET stock_quantity = stock_quantity - $2,
                     updated_at = NOW()
                 WHERE id = $1 AND stock_quantity >= $2
                 RETURNING id, price, stock_quantity`,
                [id, quantity]
            );

            if (stockResult.rowCount === 0) {
                const exists = await client.query(
                    "SELECT id FROM books WHERE id = $1",
                    [id]
                );

                if (exists.rowCount === 0) {
                    const error = new Error("Libro no encontrado.");
                    error.statusCode = 404;
                    throw error;
                }

                const error = new Error("Stock insuficiente.");
                error.statusCode = 409;
                throw error;
            }

            const book = stockResult.rows[0];
            const total = Number(book.price) * quantity;

            // Creamos el registro general de la venta.
            const saleResult = await client.query(
                `INSERT INTO sales (total)
                 VALUES ($1)
                 RETURNING id, total, created_at`,
                [total]
            );

            const sale = saleResult.rows[0];

            // Relacionamos la venta con el libro y su cantidad.
            await client.query(
                `INSERT INTO sale_items
                    (sale_id, book_id, quantity, unit_price)
                 VALUES ($1, $2, $3, $4)`,
                [sale.id, id, quantity, book.price]
            );

            await client.query("COMMIT");

            return {
                saleId: sale.id,
                bookId: id,
                quantity,
                unitPrice: Number(book.price),
                total,
                remainingStock: book.stock_quantity
            };
        } catch (error) {
            // Si una operación falla, revertimos todos los cambios.
            await client.query("ROLLBACK");
            throw error;
        } finally {
            // Devuelve la conexión al pool incluso si hubo un error.
            client.release();
        }
    }
};