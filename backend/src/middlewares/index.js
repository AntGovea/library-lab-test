import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';

export class Middlewares {
  static configure(app) {
    // Cabeceras de seguridad HTTP.
    app.use(helmet());

    // Permite peticiones desde el frontend autorizado.
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      })
    );

    // Convierte JSON entrante a req.body con límite de tamaño.
    app.use(express.json({ limit: '100kb' }));

    // Soporte para formularios URL-encoded.
    app.use(express.urlencoded({ extended: false, limit: '100kb' }));

    // Registro de peticiones, excepto durante las pruebas.
    if (process.env.NODE_ENV !== 'test') {
      app.use(morgan('dev'));
    }
  }
}