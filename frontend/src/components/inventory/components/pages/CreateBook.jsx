
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import BookForm from "./BookForm";
import { createBook } from "../../../../services/bookService";

export default function CreateBook() {
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [createdBook, setCreatedBook] = useState(null);
  const [formKey, setFormKey] = useState(0);

  async function handleCreate(book) {
    try {
      setSuccess("");
      setError("");
      setCreatedBook(null);

      // El ID lo genera el backend.
      const { id, ...bookData } = book;

      const response = await createBook(bookData);
      const newBook = response.data?.data ?? response.data;

      setCreatedBook(newBook);
      setSuccess("¡Libro registrado correctamente!");
      setFormKey((previous) => previous + 1);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "No se pudo registrar el libro. Inténtalo nuevamente."
      );
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Agregar libro
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Completa los datos. El ID se generará automáticamente.
        </p>
      </div>

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">{success}</p>
            {createdBook?.id && (
              <p className="mt-1 text-sm">
                ID generado: <strong>{createdBook.id}</strong>
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <BookForm
        key={formKey}
        onSubmit={handleCreate}
        submitLabel="Registrar libro"
      />
    </section>
  );
}
