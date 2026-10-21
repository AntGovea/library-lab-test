
export function validateBook(book) {
  const errors = {};

  // Campos obligatorios
  if (!String(book.title ?? "").trim()) {
    errors.title = "El título es obligatorio.";
  }

  if (!String(book.author ?? "").trim()) {
    errors.author = "El autor es obligatorio.";
  }

  if (!String(book.genre ?? "").trim()) {
    errors.genre = "El género es obligatorio.";
  }

  // Precio
  const price = book.price;

  if (price === "" || price === null || price === undefined) {
    errors.price = "El precio es obligatorio.";
  } else if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
    errors.price = "El precio debe ser mayor que cero.";
  }

  // Existencias
  const stock = book.stock_quantity;

  if (stock === "" || stock === null || stock === undefined) {
    errors.stock_quantity = "Las existencias son obligatorias.";
  } else if (!Number.isInteger(Number(stock)) || Number(stock) < 0) {
    errors.stock_quantity = "Las existencias deben ser un número entero igual o mayor que cero.";
  }

  // Año de publicación: si se proporciona, debe estar entre 1000 y 2100
  const year = String(book.publication_year ?? "").trim();

  if (year !== "") {
    const numericYear = Number(year);

    if (
      !Number.isInteger(numericYear) ||
      numericYear < 1000 ||
      numericYear > 2100
    ) {
      errors.publication_year =
        "El año debe estar entre 1000 y 2100.";
    }
  }

  // Número de páginas: opcional, pero debe ser entero positivo
  const pages = String(book.pages ?? "").trim();

  if (pages !== "") {
    const numericPages = Number(pages);

    if (!Number.isInteger(numericPages) || numericPages <= 0) {
      errors.pages = "Las páginas deben ser un número entero mayor que cero.";
    }
  }

  // ISBN: validación básica de formato, no comprueba duplicados
  const isbn = String(book.isbn ?? "").trim();

  if (isbn !== "" && !/^[0-9Xx-]{10,17}$/.test(isbn)) {
    errors.isbn = "Revisa el formato del ISBN.";
  }

  // URL de imagen: opcional
  const imageUrl = String(book.image_url ?? "").trim();

  if (imageUrl !== "") {
    try {
      const url = new URL(imageUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        errors.image_url = "La imagen debe usar una URL HTTP o HTTPS.";
      }
    } catch {
      errors.image_url = "Introduce una URL válida para la imagen.";
    }
  }

  return errors;
}
