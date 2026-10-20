import { useEffect, useState } from 'react'
import {
    Search,
    BookOpen,
    RefreshCw,
    AlertCircle,
    Package,
    UserRound,
    Tag,
} from 'lucide-react'

// Dirección de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function Catalog() {
    // Lista de libros que devuelve el backend
    const [books, setBooks] = useState([])

    // Texto que escribe el usuario para buscar
    const [search, setSearch] = useState('')

    // Estados para mostrar qué está pasando
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // Consulta los libros al backend
    const loadBooks = async (searchText = '') => {
        try {
            setLoading(true)
            setError('')

            // Si hay búsqueda, la agregamos a la URL
            const query = searchText.trim()
                ? `?search=${encodeURIComponent(searchText.trim())}`
                : ''

            const response = await fetch(`${API_URL}/api/books${query}`)

            if (!response.ok) {
                throw new Error('No se pudieron cargar los libros.')
            }

            const result = await response.json()

            // El controlador devuelve los datos dentro de "data"
            setBooks(result.data ?? [])
        } catch (error) {
            setError(
                error.message ||
                'No fue posible conectar con el servidor.'
            )
        } finally {
            setLoading(false)
        }
    }

    // Carga los libros al abrir el catálogo
    useEffect(() => {
        loadBooks()
    }, [])

    // Busca cuando se envía el formulario
    const handleSearch = (event) => {
        event.preventDefault()
        loadBooks(search)
    }

    // Formatea el precio como moneda mexicana
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(Number(price) || 0)
    }

    return (
        <section className="space-y-6">
            {/* Encabezado del catálogo */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-lg shadow-blue-200/60">
                            <BookOpen size={24} />
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-slate-900">
                                Catálogo de libros
                            </h3>

                            <p className="text-sm text-slate-500">
                                Consulta y encuentra tus libros.
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loadBooks(search)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Actualizar
                </button>
            </div>

            {/* Buscador */}
            <form
                onSubmit={handleSearch}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:flex-row"
            >
                <div className="relative flex-1">
                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Buscar por título, autor o género..."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50"
                >
                    Buscar
                </button>
            </form>

            {/* Resumen */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500">
                    {loading
                        ? 'Consultando biblioteca...'
                        : `${books.length} ${books.length === 1 ? 'libro encontrado' : 'libros encontrados'
                        }`}
                </p>

                <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700">
                    <Package size={14} />
                    Base de datos
                </span>
            </div>

            {/* Cargando */}
            {loading && (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                        >
                            <div className="mb-4 h-12 w-12 rounded-xl bg-slate-200" />
                            <div className="mb-3 h-4 w-3/4 rounded bg-slate-200" />
                            <div className="mb-5 h-3 w-1/2 rounded bg-slate-100" />
                            <div className="h-16 rounded-xl bg-slate-100" />
                        </div>
                    ))}
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                    <div className="flex items-start gap-3">
                        <AlertCircle
                            size={22}
                            className="mt-0.5 shrink-0 text-rose-500"
                        />

                        <div className="flex-1">
                            <h4 className="font-bold text-rose-800">
                                No se pudo cargar el catálogo
                            </h4>

                            <p className="mt-1 text-sm text-rose-700">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() => loadBooks(search)}
                                className="mt-3 text-sm font-bold text-rose-800 underline underline-offset-4"
                            >
                                Intentar nuevamente
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Catálogo */}
            {!loading && !error && books.length > 0 && (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {books.map((book) => (
                        <article
                            key={book.id}
                            className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"
                        >
                            {/* Parte superior */}
                            <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-100 via-violet-50 to-cyan-100">
                                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/40 blur-2xl" />

                                    <img
                                        src={book.image_url || '/book-placeholder.png'}
                                        alt={`Portada de ${book.title}`}
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                        onError={(event) => {
                                            event.currentTarget.onerror = null
                                            event.currentTarget.src = '/book-placeholder.png'
                                        }}
                                    />

                                <span className="absolute left-4 top-4 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-bold text-violet-700">
                                    {book.id}
                                </span>
                            </div>

                            {/* Información del libro */}
                            <div className="space-y-4 p-5">
                                <div>
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                                        <Tag size={13} />
                                        {book.genre || 'Sin género'}
                                    </span>

                                    <h4 className="mt-2 line-clamp-2 text-lg font-extrabold leading-snug text-slate-900">
                                        {book.title}
                                    </h4>

                                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                                        <UserRound size={15} className="shrink-0" />
                                        <span className="line-clamp-1">
                                            {book.author}
                                        </span>
                                    </p>
                                </div>

                                {book.description && (
                                    <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
                                        {book.description}
                                    </p>
                                )}

                                {/* Precio e inventario */}
                                <div className="flex items-end justify-between border-t border-slate-100 pt-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">
                                            Precio
                                        </p>

                                        <p className="mt-1 text-xl font-extrabold text-violet-700">
                                            {formatPrice(book.price)}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-400">
                                            Existencias
                                        </p>

                                        <span
                                            className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-bold ${Number(book.stock_quantity) > 0
                                                    ? 'bg-emerald-50 text-emerald-700'
                                                    : 'bg-rose-50 text-rose-700'
                                                }`}
                                        >
                                            {Number(book.stock_quantity) > 0
                                                ? `${book.stock_quantity} disponibles`
                                                : 'Agotado'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {/* Sin resultados */}
            {!loading && !error && books.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <BookOpen size={30} />
                    </div>

                    <h4 className="mt-4 text-lg font-extrabold text-slate-800">
                        No encontramos libros
                    </h4>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
                        {search
                            ? 'Prueba con otro título, autor o género.'
                            : 'Todavía no hay libros registrados en la biblioteca.'}
                    </p>

                    {search && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('')
                                loadBooks('')
                            }}
                            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700"
                        >
                            Ver todos los libros
                        </button>
                    )}
                </div>
            )}
        </section>
    )
}

export default Catalog