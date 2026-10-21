
import { BookOpen, ShoppingBag } from "lucide-react";

export default function BookCard({ book, onClick }) {
  const price = Number(book.price);

  const formatPrice = Number.isFinite(price)
    ? price.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN",
      })
    : "Precio no disponible";

  const stock = Number(book.stock_quantity ?? 0);
  const hasStock = stock > 0;

  return (
    <button
      type="button"
      onClick={() => onClick(book)}
      aria-label={`Ver detalles de ${book.title}`}
      className="group flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-violet-100"
    >
      {/* Portada */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-br from-violet-100 to-indigo-100">
        {book.image_url && (
          <img
            src={book.image_url}
            alt={`Portada de ${book.title}`}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
        )}

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 text-violet-500 ${
            book.image_url ? "hidden" : ""
          }`}
        >
          <BookOpen size={40} strokeWidth={1.5} />
          <span className="px-3 text-center text-xs font-medium">
            Sin portada disponible
          </span>
        </div>

        {/* Existencias */}
        <span
          className={`absolute left-2 top-2 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
            hasStock
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {hasStock ? `${stock} disponibles` : "Agotado"}
        </span>
      </div>

      {/* Información */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <div className="space-y-1">
          <h3 className="line-clamp-2 min-h-10 font-bold leading-5 text-slate-900">
            {book.title}
          </h3>

          <p className="line-clamp-1 text-sm text-slate-500">
            {book.author || "Autor no especificado"}
          </p>
        </div>

        {/* Género */}
        {book.genre && (
          <div>
            <span className="inline-block max-w-full truncate rounded-lg bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700">
              {book.genre}
            </span>
          </div>
        )}

        {/* Editorial y año */}
        {(book.publisher || book.publication_year) && (
          <p className="line-clamp-1 text-xs text-slate-500">
            {[book.publisher, book.publication_year]
              .filter(
                (value) =>
                  value !== null &&
                  value !== undefined &&
                  value !== ""
              )
              .join(" · ")}
          </p>
        )}

        {/* Precio y detalles */}
        <div className="mt-auto border-t border-slate-100 pt-3">
          <p className="text-lg font-extrabold text-violet-700">
            {formatPrice}
          </p>

          <div className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition group-hover:bg-violet-700">
            <ShoppingBag size={16} />
            Ver detalles
          </div>
        </div>
      </div>
    </button>
  );
}
