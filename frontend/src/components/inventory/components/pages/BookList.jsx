
import { useCallback, useEffect, useState } from "react";
import { RefreshCw, BookOpen } from "lucide-react";
import { getBooks } from "../../../../services/bookService";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getBooks();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "No se pudo cargar el inventario."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Inventario de libros
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Consulta los libros registrados y sus existencias.
          </p>
        </div>

        <button
          type="button"
          onClick={loadBooks}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      {loading && (
        <p className="py-8 text-center text-slate-500">
          Cargando inventario...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          <p>{error}</p>
          <button
            type="button"
            onClick={loadBooks}
            className="mt-2 font-semibold underline"
          >
            Intentar de nuevo
          </button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="py-12 text-center">
          <BookOpen className="mx-auto mb-3 text-slate-400" size={36} />
          <p className="font-medium text-slate-700">
            No hay libros registrados.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Agrega un libro para comenzar.
          </p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Libro</th>
                <th className="px-4 py-3">Autor</th>
                <th className="px-4 py-3">Género</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Existencias</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="px-4 py-4 font-semibold text-violet-700">
                    {book.id}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {book.title}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {book.author}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {book.genre || "—"}
                  </td>
                  <td className="px-4 py-4 text-slate-700">
                    {Number(book.price).toLocaleString("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        Number(book.stock_quantity) > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {book.stock_quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <p className="mt-4 text-xs text-slate-500">
          Total de libros: {books.length}
        </p>
      )}
    </section>
  );
}
