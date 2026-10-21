
import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import BookForm from "./BookForm";
import {
  getBookById,
  updateBook,
} from "../../../../services/bookService";
import { getBookIdError } from "../../../../utils/validateBookId";
export default function EditBook({ onBack }) {
  const [bookId, setBookId] = useState("");
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searching, setSearching] = useState(false);

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
      setSearching(true);
      const validationMessage = getBookIdError(bookId);

      if (validationMessage) {
        setError(validationMessage);
        return;
      }

      setError("");
      const result = await getBookById(bookId.trim().toUpperCase());
      setBook(result?.data ?? result);
    } catch (err) {
      console.log('err', err)
      console.log(' err.response?.status', err.response?.status)
      setError(
        err.response?.status === 404
          ? "No se encontró un libro con ese ID."
          : err.response?.data?.message ||
          err.message ||
          "No se pudo buscar el libro."
      );
    } finally {
      setSearching(false);
    }
  }

  async function handleUpdate(values) {
    setError("");
    setSuccess("");

    try {
      await updateBook(book.id, values);

      setBook((previous) => ({ ...previous, ...values }));
      setSuccess("El libro se actualizó correctamente.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "No se pudo actualizar el libro."
      );

      throw err;
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-bold text-slate-800">
        Editar libro
      </h2>

      <p className="mb-6 mt-1 text-sm text-slate-500">
        Busca un libro por su ID para modificar sus datos.
      </p>

      <form
        onSubmit={handleSearch}
        className="mb-6 flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={bookId}
          onChange={(event) =>
            setBookId(event.target.value.toUpperCase())
          }
          placeholder="Ej. A12"
          maxLength={3}
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
        />

        <button
          type="submit"
          disabled={searching}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Search size={17} />
          {searching ? "Buscando..." : "Buscar libro"}
        </button>
      </form>

      {error && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          {error}
        </p>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          <CheckCircle2 size={18} />
          {success}
        </div>
      )}

      {book && (
        <>
          <div className="mb-5 rounded-xl bg-violet-50 p-4 text-sm text-violet-800">
            Editando el libro <strong>{book.id}</strong>
          </div>

          <BookForm
            key={book.id}
            initialValues={book}
            isEditing
            submitLabel="Guardar cambios"
            onSubmit={handleUpdate}
          />
        </>
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
