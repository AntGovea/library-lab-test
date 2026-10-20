import pg from 'pg';

const { Pool } = pg;

// Pool reutiliza conexiones en lugar de abrir una por cada petición.
// Las variables de entorno permiten cambiar la configuración sin
// modificar el código.
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'biblioteca',
  user: process.env.DB_USER || 'biblioteca_user',
  password: process.env.DB_PASSWORD,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

// Errores inesperados en conexiones inactivas del pool.
pool.on('error', (error) => {
  console.error('Error inesperado en el pool de PostgreSQL:', error);
});

// Exportamos el pool para usarlo desde repositorios o servicios.
export default pool;