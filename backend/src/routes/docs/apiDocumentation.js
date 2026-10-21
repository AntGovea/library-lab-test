
export const apiDocumentation = {
  info: {
    title: "Books API",
    version: "1.0.0",
    description:
      "API REST para administrar libros, inventario y compras.",
  },

  basePath: "/api",

  conventions: {
    bookId: {
      format: "Una letra mayúscula seguida de dos números.",
      example: "A12",
    },
    responseFormat: {
      success: "{ data: ... }",
      error: "{ error: { message: ... } }",
    },
  },

  endpoints: [
    {
      group: "Sistema",
      method: "GET",
      path: "/health",
      description: "Comprueba que la API esté funcionando.",
      responses: [
        { status: 200, description: "API funcionando." },
      ],
    },
    {
      group: "Sistema",
      method: "GET",
      path: "/ready",
      description: "Comprueba la disponibilidad de la base de datos.",
      responses: [
        { status: 200, description: "API y base de datos disponibles." },
        { status: 503, description: "Base de datos no disponible." },
      ],
    },
    {
      group: "Libros",
      method: "GET",
      path: "/api/books",
      description: "Obtiene el catálogo de libros.",
      query: [
        {
          name: "search",
          required: false,
          description:
            "Texto para buscar por los campos admitidos por el backend.",
          example: "fantasía",
        },
      ],
      responses: [
        { status: 200, description: "Lista de libros obtenida." },
      ],
    },
    {
      group: "Libros",
      method: "GET",
      path: "/api/books/:id",
      description: "Obtiene un libro por su ID.",
      params: [
        {
          name: "id",
          required: true,
          example: "A12",
        },
      ],
      responses: [
        { status: 200, description: "Libro encontrado." },
        { status: 400, description: "Formato de ID inválido." },
        { status: 404, description: "Libro no encontrado." },
      ],
    },
    {
      group: "Libros",
      method: "POST",
      path: "/api/books",
      description: "Registra un libro nuevo.",
      bodyExample: {
        title: "El principito",
        author: "Antoine de Saint-Exupéry",
        genre: "Fantasía",
        isbn: "9780156012195",
        price: 199.99,
        stock_quantity: 10,
      },
      responses: [
        { status: 201, description: "Libro creado." },
        { status: 400, description: "Datos inválidos." },
        { status: 409, description: "Conflicto, por ejemplo ISBN duplicado." },
      ],
    },
    {
      group: "Libros",
      method: "PUT",
      path: "/api/books/:id",
      description: "Actualiza los datos de un libro.",
      params: [
        {
          name: "id",
          required: true,
          example: "A12",
        },
      ],
      responses: [
        { status: 200, description: "Libro actualizado." },
        { status: 400, description: "ID o datos inválidos." },
        { status: 404, description: "Libro no encontrado." },
        { status: 409, description: "Conflicto con los datos." },
      ],
    },
    {
      group: "Libros",
      method: "DELETE",
      path: "/api/books/:id",
      description: "Elimina un libro por su ID.",
      params: [
        {
          name: "id",
          required: true,
          example: "A12",
        },
      ],
      responses: [
        { status: 200, description: "Libro eliminado." },
        { status: 400, description: "Formato de ID inválido." },
        { status: 404, description: "Libro no encontrado." },
      ],
    },
    // {
    //   group: "Compras",
    //   method: "POST",
    //   path: "/api/books/:id/purchase",
    //   description: "Registra una compra y actualiza las existencias.",
    //   params: [
    //     {
    //       name: "id",
    //       required: true,
    //       example: "A12",
    //     },
    //   ],
    //   bodyExample: {
    //     quantity: 1,
    //   },
    //   responses: [
    //     { status: 200, description: "Compra realizada." },
    //     { status: 400, description: "Datos inválidos." },
    //     { status: 404, description: "Libro no encontrado." },
    //     { status: 409, description: "Stock insuficiente." },
    //   ],
    // },
  ],
};
