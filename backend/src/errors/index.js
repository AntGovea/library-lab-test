export class Errors {
    // Debe registrarse después de todas las rutas.
    static notFound(app) {
        app.use((req, res) => {
            res.status(404).json({
                error: {
                    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
                },
            });
        });
    }

    // Middleware centralizado de errores: cuatro parámetros.
    static handler(app) {
        app.use((err, req, res, next) => {
            if (res.headersSent) {
                return next(err);
            }

            console.error(err);

            // Solo aceptamos códigos HTTP válidos como errores controlados.
            const status =
                Number.isInteger(err.status) && err.status >= 400 && err.status <= 599
                    ? err.status
                    : 500;

            res.status(status).json({
                error: {
                    message:
                        status === 500
                            ? 'Error interno del servidor'
                            : err.message,
                },
            });
        });
    }
}