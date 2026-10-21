import app from '../app/app.js';
import {pool} from "../database/config.js";


export class Server {
  constructor() {
    this.port = Number(process.env.PORT) || 8080;
    this.server = null;
  }

  async start() {
    try {
      // Verifica la conexión antes de aceptar tráfico.
      // await pool.query('SELECT 1');

      this.server = app.listen(this.port, '0.0.0.0', () => {
        console.log(`API escuchando en el puerto ${this.port}`);
      });
    } catch (error) {
      console.error('No fue posible iniciar el backend:', error.message);
      process.exitCode = 1;
      await pool.end();
    }
  }

  async stop() {
    // Deja de aceptar conexiones y cierra las conexiones de PostgreSQL.
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await pool.end();
  }
}