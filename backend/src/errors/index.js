
const DATABASE_CONNECTION_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "EHOSTUNREACH",
  "ENETUNREACH",
  "08000",
  "08001",
  "08003",
  "08006",
  "08004",
  "57P01",
]);

function getErrorResponse(error) {
  // JSON inválido enviado al servidor.
  if (
    error.type === "entity.parse.failed" ||
    (error instanceof SyntaxError && "body" in error)
  ) {
    return {
      status: 400,
      message: "El cuerpo de la petición contiene JSON inválido.",
    };
  }

  // Cuerpo demasiado grande.
  if (error.type === "entity.too.large") {
    return {
      status: 413,
      message: "El contenido enviado supera el tamaño permitido.",
    };
  }

  // Problemas de conexión con PostgreSQL.
  if (DATABASE_CONNECTION_CODES.has(error.code)) {
    return {
      status: 503,
      message: "El servicio no está disponible temporalmente.",
    };
  }

  // Errores de restricciones de PostgreSQL.
  switch (error.code) {
    case "23505": {
      const isIsbnConstraint = /isbn/i.test(error.constraint || "");

      return {
        status: 409,
        message: isIsbnConstraint
          ? "Ya existe un libro con ese ISBN."
          : "Ya existe un registro con esos datos.",
      };
    }

    case "23502":
      return {
        status: 400,
        message: "Falta un campo obligatorio.",
      };

    case "23503":
      return {
        status: 409,
        message:
          "No se puede completar la operación porque el registro está relacionado con otros datos.",
      };

    case "23514":
      return {
        status: 400,
        message: "Los datos no cumplen las reglas permitidas.",
      };

    case "22P02":
      return {
        status: 400,
        message: "Uno o más datos tienen un formato inválido.",
      };

    default:
      break;
  }

  const status = Number(error.statusCode ?? error.status);

  // Solo aceptamos errores HTTP controlados entre 400 y 499.
  if (Number.isInteger(status) && status >= 400 && status < 500) {
    return {
      status,
      message: error.message || "La petición no pudo completarse.",
    };
  }

  // Los errores desconocidos nunca exponen detalles internos.
  return {
    status: 500,
    message: "Error interno del servidor. Inténtalo más tarde.",
  };
}

export class Errors {
  // Se registra después de todas las rutas.
  static notFound(app) {
    app.use((req, res) => {
      res.status(404).json({
        error: {
          message: "La ruta solicitada no existe.",
        },
      });
    });
  }

  // Middleware global de errores de Express: cuatro parámetros.
  static handler(app) {
    app.use((error, req, res, next) => {
      if (res.headersSent) {
        return next(error);
      }

      const result = getErrorResponse(error);

      // Los detalles técnicos quedan en el backend, no en la respuesta HTTP.
      if (result.status >= 500) {
        console.error("Error interno:", {
          message: error.message,
          code: error.code,
          stack: error.stack,
          path: req.originalUrl,
          method: req.method,
        });
      }

      return res.status(result.status).json({
        error: {
          message: result.message,
        },
      });
    });
  }
}
