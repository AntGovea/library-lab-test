
-- =========================================================
-- NEXORA - ESQUEMA INICIAL DE LA BASE DE DATOS
--
-- Orden de creación:
-- 1. books
-- 2. Índices para búsqueda de libros
-- 3. sales
-- 4. sale_items
-- =========================================================


-- =========================================================
-- TABLA: BOOKS
-- Catálogo de libros disponibles en la tienda.
-- =========================================================

CREATE TABLE IF NOT EXISTS books (
    -- ID generado por el backend.
    -- Formato: una letra mayúscula seguida de dos dígitos.
    -- Ejemplo: A12.
    id VARCHAR(3) PRIMARY KEY
        CHECK (id ~ '^[A-Z][0-9]{2}$'),

    -- Datos obligatorios del libro.
    title VARCHAR(200) NOT NULL
        CHECK (LENGTH(TRIM(title)) > 0),

    author VARCHAR(150) NOT NULL
        CHECK (LENGTH(TRIM(author)) > 0),

    genre VARCHAR(100) NOT NULL
        CHECK (LENGTH(TRIM(genre)) > 0),

    -- Datos adicionales opcionales.
    -- ISBN debe ser único cuando se proporciona.
    isbn VARCHAR(17) UNIQUE,

    publisher VARCHAR(150),

    -- Año de publicación opcional.
    publication_year SMALLINT
        CHECK (publication_year BETWEEN 1000 AND 2100),

    description TEXT,

    -- Número de páginas opcional, pero positivo si existe.
    pages INTEGER
        CHECK (pages > 0),

    language VARCHAR(50),

    -- Precio obligatorio y mayor que cero.
    price NUMERIC(10, 2) NOT NULL
        CHECK (price > 0),

    -- Inventario inicial de cero si no se especifica.
    stock_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (stock_quantity >= 0),

    -- URL de la portada del libro; opcional.
    image_url TEXT,

    -- Fecha y hora de creación.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Fecha y hora de última actualización.
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- ÍNDICES PARA EL BUSCADOR
--
-- Permiten buscar por título, autor o género.
-- Son índices de trigramas para búsquedas parciales
-- y sin distinguir mayúsculas/minúsculas con ILIKE.
--
-- Requiere la extensión pg_trgm.
-- =========================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_books_title_search
    ON books USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_books_author_search
    ON books USING GIN (author gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_books_genre_search
    ON books USING GIN (genre gin_trgm_ops);


-- =========================================================
-- TABLA: SALES
-- Almacena la información general de cada venta.
-- =========================================================

CREATE TABLE IF NOT EXISTS sales (
    -- Identificador autogenerado por PostgreSQL.
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Total de la venta, calculado por el backend.
    total NUMERIC(12, 2) NOT NULL
        CHECK (total >= 0),

    -- Momento en que se registra la venta.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- =========================================================
-- TABLA: SALE_ITEMS
-- Conecta SALES y BOOKS.
--
-- Una venta puede contener muchos libros.
-- Un libro puede aparecer en muchas ventas.
-- =========================================================

CREATE TABLE IF NOT EXISTS sale_items (
    -- Identificador de cada línea de venta.
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Si se elimina una venta, se eliminan sus líneas.
    sale_id BIGINT NOT NULL
        REFERENCES sales(id) ON DELETE CASCADE,

    -- Protege los libros que tienen historial de ventas.
    book_id VARCHAR(3) NOT NULL
        REFERENCES books(id) ON DELETE RESTRICT,

    -- Cantidad de ejemplares vendidos.
    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    -- Precio por ejemplar al momento de la venta.
    -- Conserva el precio histórico aunque cambie BOOKS.price.
    unit_price NUMERIC(10, 2) NOT NULL
        CHECK (unit_price >= 0)
);


-- =========================================================
-- ÍNDICES PARA RELACIONES DE VENTAS
-- Facilitan consultas de líneas por venta o por libro.
-- =========================================================

CREATE INDEX IF NOT EXISTS idx_sale_items_sale_id
    ON sale_items (sale_id);

CREATE INDEX IF NOT EXISTS idx_sale_items_book_id
    ON sale_items (book_id);
