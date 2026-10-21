
import { useEffect } from "react";
import { BookOpen, X } from "lucide-react";

export default function BookDetailsModal({ book, onClose }) {
  useEffect(() => {
    if (!book) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const price = Number(book.price);

  const formatPrice = Number.isFinite(price)
    ? price.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      })
    : "No disponible";

  const details = [
    { label: "Género", value: book.genre },
    { label: "ISBN", value: book.isbn },
    { label: "Editorial", value: book.publisher },
    { label: "Año de publicación", value: book.publication_year },
    { label: "Número de páginas", value: book.pages },
    { label: "Idioma", value: book.language },
    { label: "Precio", value: formatPrice },
    { label: "Existencias", value: book.stock_quantity ?? 0 },
    { label: "Identificador", value: book.id },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-modal-title"
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalles"
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-600 shadow transition hover:bg-slate-100"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-5">
          {/* Portada */}
          <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-violet-100 to-indigo-100 p-6 sm:col-span-2">
            {book.image_url && (
              <img
                src={book.image_url}
                alt={`Portada de ${book.title}`}
                className="max-h-80 w-full rounded-xl object-contain"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
            )}

            <div
              className={`flex flex-col items-center gap-3 text-violet-500 ${
                book.image_url ? "hidden" : ""
              }`}
            >
              <BookOpen size={56} strokeWidth={1.3} />
              <span className="text-sm">Sin portada disponible</span>
            </div>
          </div>

          {/* Información */}
          <div className="space-y-5 p-6 sm:col-span-3 sm:p-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                Detalles del libro · ID {book.id}
              </p>

              <h2
                id="book-modal-title"
                className="mt-2 pr-6 text-2xl font-bold text-slate-900"
              >
                {book.title}
              </h2>

              <p className="mt-1 text-slate-500">
                Por {book.author || "Autor no especificado"}
              </p>

              <p className="mt-3 text-2xl font-extrabold text-violet-700">
                {formatPrice}
              </p>
            </div>

            {/* Ficha técnica */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {details.map(({ label, value }) => (
                <div
                  key={label}
                  className="min-w-0 rounded-xl bg-slate-50 p-3"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 break-words font-semibold text-slate-800">
                    {value !== null &&
                    value !== undefined &&
                    value !== ""
                      ? value
                      : "No especificado"}
                  </p>
                </div>
              ))}
            </div>

            {/* Descripción */}
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Descripción
              </h3>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {book.description || "Sin descripción disponible."}
              </p>
            </div>

            {/* URL de la portada */}
            {book.image_url && (
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  URL de la portada
                </h3>
                <a
                  href={book.image_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block break-all text-sm text-violet-600 underline hover:text-violet-800"
                >
                  {book.image_url}
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              Cerrar detalles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
