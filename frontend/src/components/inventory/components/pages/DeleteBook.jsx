
import { useState } from "react";
import { Search, Trash2, AlertTriangle } from "lucide-react";
import {
  getBookById,
  deleteBook,
} from "../../../../services/bookService";
import { getBookIdError } from "../../../../utils/validateBookId";

export default function DeleteBook({ onBack }) {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSearch(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBook(null);

    if (!bookId.trim()) {
      setError("Ingresa el ID del libro.");
      return;
    }

    try {
      setLoading(true);
      const validationMessage = getBookIdError(bookId);

      if (validationMessage) {
        setError(validationMessage);
        return;
      }

      setError("");
      const result = await getBookById(bookId.trim().toUpperCase());
      setBook(result?.data ?? result);
    } catch (err) {
      setError(
        err.response?.status === 404
          ? "No se encontró un libro con ese ID."
          : err.response?.data?.message ||
          err.message ||
          "No se pudo buscar el libro."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!book) return;

    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${book.title}" (${book.id})? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      await deleteBook(book.id);

      setSuccess(`El libro "${book.title}" se eliminó correctamente.`);
      setBook(null);
      setBookId("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "No se pudo eliminar el libro."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-800">
        Eliminar libro
      </h2>

      <p className="mb-6 mt-1 text-sm text-slate-500">
        Busca el libro por su ID y confirma la eliminación.
      </p>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={bookId}
          onChange={(event) => setBookId(event.target.value.toUpperCase())}
          placeholder="Ej. A12"
          maxLength={3}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Search size={17} />
          {loading ? "Buscando..." : "Buscar libro"}
        </button>
      </form>

      {error && (
        <p role="alert" className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      )}

      {success && (
        <p className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </p>
      )}

      {book && (
        <div className="rounded-2xl border border-rose-200 p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-rose-100 p-3 text-rose-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h3 className="font-bold text-slate-800">
                {book.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                ID: {book.id} · Autor: {book.author}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Existencias: {book.stock_quantity}
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm text-rose-700">
            Esta operación eliminará el registro del libro.
          </p>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            <Trash2 size={17} />
            {deleting ? "Eliminando..." : "Confirmar eliminación"}
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        ← Volver al menú de inventario
      </button>
    </section>
  );
}
