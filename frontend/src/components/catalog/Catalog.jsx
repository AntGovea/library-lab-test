
import { useCallback, useState } from "react";
import { BookOpen, LoaderCircle } from "lucide-react";

import useBooks from "./hooks/useBooks";
import BookSearch from "./components/BookSearch";
import BookCard from "./components/BookCard";
import BookDetailsModal from "./components/BookDetailsModal";

export default function Catalog() {
  const [search, setSearch] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);

  const { books, loading, error } = useBooks(search);

  const closeModal = useCallback(() => {
    setSelectedBook(null);
  }, []);

  return (
    <section className="space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
            <BookOpen size={26} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Catálogo de libros
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Explora nuestra colección y consulta los detalles de cada libro.
            </p>
          </div>
        </div>
      </header>

      <BookSearch value={search} onChange={setSearch} />

      {!loading && !error && (
        <p className="text-sm text-slate-500">
          {books.length}{" "}
          {books.length === 1
            ? "libro encontrado"
            : "libros encontrados"}
        </p>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
          <LoaderCircle
            size={32}
            className="animate-spin text-violet-600"
          />
          <p className="text-sm">Cargando libros...</p>
        </div>
      )}

      {error && !loading && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          {error}
          <button
            type="button"
            onClick={() => setSearch((current) => current)}
            className="ml-2 font-semibold underline"
          >
            Intenta nuevamente
          </button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <BookOpen size={40} className="mx-auto text-slate-300" />

          <h2 className="mt-4 font-semibold text-slate-800">
            No encontramos libros
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {search.trim()
              ? "Prueba con otro título, autor o género."
              : "Todavía no hay libros registrados en el catálogo."}
          </p>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onClick={setSelectedBook}
            />
          ))}
        </div>
      )}

      <BookDetailsModal
        book={selectedBook}
        onClose={closeModal}
      />
    </section>
  );
}
