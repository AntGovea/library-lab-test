
import { useEffect, useState } from "react";
import { getBooks } from "../../../services/bookService";

export default function useBooks(search) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const results = await getBooks(search);

        if (active) {
          setBooks(results);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "No se pudieron cargar los libros."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [search]);

  return { books, loading, error };
}
