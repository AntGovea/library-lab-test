export class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);

        // El nombre facilita identificar el tipo de error.
        this.name = "HttpError";
        this.statusCode = statusCode;
    }
}