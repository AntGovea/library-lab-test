
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";

export class Middlewares {
  static configure(app) {
    // Cabeceras de seguridad HTTP.
    app.use(helmet());

    // Permite peticiones desde el frontend autorizado.
    app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
      })
    );

    // Procesamiento del cuerpo de las peticiones.
    app.use(express.json({ limit: "100kb" }));
    app.use(express.urlencoded({ extended: false, limit: "100kb" }));

    // Registro de peticiones, excepto durante las pruebas.
    if (process.env.NODE_ENV !== "test") {
      app.use(morgan("dev"));
    }
  }

  // Debe registrarse después de todas las rutas.
  static notFound(req, res) {
    return res.status(404).json({
      success: false,
      message: "La ruta solicitada no existe.",
    });
  }

  // Middleware global de errores de Express.
  // Debe registrarse después de las rutas y del middleware notFound.
  static errorHandler(error, req, res, next) {
    let statusCode = Number(error.statusCode || error.status) || 500;
    let message = error.message;

    // JSON mal formado enviado por el cliente.
    if (error instanceof SyntaxError && "body" in error) {
      statusCode = 400;
      message = "El cuerpo de la petición contiene JSON inválido.";
    }

    // Cuerpo de la petición demasiado grande.
    if (error.type === "entity.too.large") {
      statusCode = 413;
      message = "El contenido enviado supera el tamaño permitido.";
    }

    // Restricciones conocidas de PostgreSQL.
    if (error.code === "23505") {
      statusCode = 409;

      // El nombre depende de cómo se creó la restricción en PostgreSQL.
      message = /isbn/i.test(error.constraint || "")
        ? "Ya existe un libro con ese ISBN."
        : "Ya existe un registro con esos datos.";
    } else if (error.code === "23514") {
      statusCode = 400;
      message = "Los datos no cumplen las reglas permitidas.";
    } else if (error.code === "23502") {
      statusCode = 400;
      message = "Falta un campo obligatorio.";
    } else if (error.code === "23503") {
      statusCode = 409;
      message =
        "No se puede completar la operación porque el registro está relacionado con otros datos.";
    } else if (error.code === "22P02") {
      statusCode = 400;
      message = "Uno o más datos tienen un formato inválido.";
    }

    // Fallos de conexión o indisponibilidad de PostgreSQL.
    const connectionCodes = [
      "ECONNREFUSED",
      "ECONNRESET",
      "ETIMEDOUT",
      "08000",
      "08003",
      "08006",
      "57P01",
    ];

    if (connectionCodes.includes(error.code)) {
      statusCode = 503;
      message = "El servicio no está disponible temporalmente.";
    }

    // No exponemos mensajes SQL ni detalles internos en errores 5xx.
    if (statusCode >= 500) {
      console.error("Error interno:", error);

      message =
        statusCode === 503
          ? "El servicio no está disponible temporalmente."
          : "Ocurrió un error interno. Inténtalo más tarde.";
    } else {
      // Solo mensajes controlados para errores que puede corregir el cliente.
      const safeMessages = new Set([
        "El cuerpo de la petición contiene JSON inválido.",
        "El contenido enviado supera el tamaño permitido.",
        "La ruta solicitada no existe.",
        "Ya existe un libro con ese ISBN.",
        "Ya existe un registro con esos datos.",
        "Los datos no cumplen las reglas permitidas.",
        "Falta un campo obligatorio.",
        "No se puede completar la operación porque el registro está relacionado con otros datos.",
        "Uno o más datos tienen un formato inválido.",
        "El servicio no está disponible temporalmente.",
      ]);

      if (!safeMessages.has(message) && error.statusCode !== 404 && error.statusCode !== 409) {
        message = "La petición no pudo completarse.";
      }
    }

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
