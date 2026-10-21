
export function isValidBookId(id) {
  return /^[A-Z]\d{2}$/.test(String(id ?? "").trim());
}

export function getBookIdError(id) {
  const value = String(id ?? "").trim();

  if (!value) {
    return "Introduce el ID del libro.";
  }

  if (!isValidBookId(value)) {
    return "El ID debe tener una letra mayúscula y dos números. Ejemplo: A12.";
  }

  return "";
}
