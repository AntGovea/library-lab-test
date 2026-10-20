
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function getBooks() {
    const response = await fetch(`${API_URL}/api/books`);

    if (!response.ok) {
        throw new Error("No se pudieron cargar los libros.");
    }

    const result = await response.json();

    // Nuestro backend devuelve los libros dentro de data.
    return result.data;
}
