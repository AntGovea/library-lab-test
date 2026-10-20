
-- =========================================================
-- NEXORA - ESQUEMA INICIAL DE LA BASE DE DATOS
-- Orden de creación:
-- 1. books
-- 2. sales
-- 3. sale_items
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
    -- Si existe, debe estar entre 1000 y 2100.
    publication_year SMALLINT
        CHECK (publication_year BETWEEN 1000 AND 2100),

    description TEXT,

    -- Número de páginas opcional, pero positivo si existe.
    pages INTEGER
        CHECK (pages > 0),

    language VARCHAR(50),

    -- Precio obligatorio y mayor que cero.
    -- NUMERIC(10,2) permite almacenar dos decimales.
    price NUMERIC(10, 2) NOT NULL
        CHECK (price > 0),

    -- Inventario inicial de cero si no se especifica.
    -- Nunca se permiten cantidades negativas.
    stock_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (stock_quantity >= 0),


    image_url TEXT,
    -- PostgreSQL asigna la fecha y hora automáticamente.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Se debe actualizar desde el backend al editar un libro.
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


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
-- Tabla intermedia que conecta SALES y BOOKS.
--
-- Una venta puede contener muchos libros.
-- Un libro puede aparecer en muchas ventas.
-- Por eso esta tabla resuelve la relación muchos a muchos.
-- =========================================================

CREATE TABLE IF NOT EXISTS sale_items (
    -- Identificador de cada línea de venta.
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    -- Clave foránea hacia la venta correspondiente.
    -- Si se elimina una venta, se eliminan sus líneas.
    sale_id BIGINT NOT NULL
        REFERENCES sales(id) ON DELETE CASCADE,

    -- Clave foránea hacia el libro vendido.
    -- RESTRICT protege los libros que tienen historial de ventas.
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
