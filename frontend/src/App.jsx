import { useState } from 'react'
import {
  LayoutDashboard,
  Orbit,
  Search,
  Boxes,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Library,
  BookOpen,
} from 'lucide-react'
import Dashboard from "./pages/Dashboard";
import Documentation from "./pages/Documentation";
import Catalog from './components/catalog/Catalog'
import Inventory from "./components/inventory/Inventory";
const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Resumen general',
    icon: LayoutDashboard,
    color: 'from-violet-500 to-indigo-500',
    activeBg: 'bg-violet-50',
    activeText: 'text-violet-700',
  },
  {
    id: 'catalog',
    label: 'Catálogo',
    description: 'Administrar libros',
    icon: Orbit,
    color: 'from-blue-500 to-cyan-400',
    activeBg: 'bg-blue-50',
    activeText: 'text-blue-700',
  },
  {
    id: 'search',
    label: 'Buscar libros',
    description: 'Encuentra un libro',
    icon: Search,
    color: 'from-emerald-500 to-teal-400',
    activeBg: 'bg-emerald-50',
    activeText: 'text-emerald-700',
  },
  {
    id: 'inventory',
    label: 'Inventario',
    description: 'Control de existencias',
    icon: Boxes,
    color: 'from-amber-400 to-orange-500',
    activeBg: 'bg-amber-50',
    activeText: 'text-amber-700',
  },
  // {
  //   id: 'trash',
  //   label: 'Papelera',
  //   description: 'Libros eliminados',
  //   icon: Trash2,
  //   color: 'from-rose-500 to-pink-400',
  //   activeBg: 'bg-rose-50',
  //   activeText: 'text-rose-700',
  // },
  // {
  //   id: 'settings',
  //   label: 'Configuración',
  //   description: 'Preferencias del sistema',
  //   icon: Settings,
  //   color: 'from-slate-500 to-slate-400',
  //   activeBg: 'bg-slate-100',
  //   activeText: 'text-slate-700',
  // },

  {
    id: 'documentation',
    label: 'Documentación API',
    description: 'Endpoints y respuestas del backend',
    icon: BookOpen,
    color: 'from-fuchsia-500 to-pink-400',
    activeBg: 'bg-fuchsia-50',
    activeText: 'text-fuchsia-700',
  },

]

function App() {
  const [activeModule, setActiveModule] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

  const activeItem =
    menuItems.find((item) => item.id === activeModule) ?? menuItems[0]

  const ActiveIcon = activeItem.icon

  const navigateTo = (moduleId) => {
    setActiveModule(moduleId)
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Fondo decorativo */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col
          border-r border-slate-200/70 bg-white/95 shadow-xl shadow-slate-200/40
          backdrop-blur-xl transition-transform duration-300
          lg:translate-x-0
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="flex h-24 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-300/50">
              <Library size={25} />
            </div>

            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                Libreria
              </h1>
              <p className="text-xs font-medium text-slate-400">
                Sistema de libreri
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        {/* Navegación */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-7">
          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Menú principal
          </p>

          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeModule === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-left transition-all duration-200 ${isActive
                  ? `${item.activeBg} ${item.activeText} shadow-sm`
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {isActive && (
                  <span
                    className={`absolute bottom-3 left-0 top-3 w-1 rounded-r-full bg-gradient-to-b ${item.color}`}
                  />
                )}

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${isActive
                    ? `bg-gradient-to-br ${item.color} text-white shadow-md`
                    : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:shadow-sm'
                    }`}
                >
                  <Icon size={19} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">
                    {item.label}
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-xs ${isActive ? 'opacity-75' : 'text-slate-400'
                      }`}
                  >
                    {item.description}
                  </span>
                </span>

                {isActive && (
                  <ChevronRight size={17} className="shrink-0 opacity-70" />
                )}
              </button>
            )
          })}
        </nav>

        {/* Tarjeta inferior */}
        {/* <div className="p-4">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-500 p-4 text-white shadow-lg shadow-violet-200/70">
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
            <div className="relative">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <Sparkles size={19} />
              </div>
              <p className="text-sm font-bold">Un espacio para aprender</p>
              <p className="mt-1 text-xs leading-relaxed text-white/75">
                Cada libro abre una nueva historia.
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            BookSpace · v1.0
          </p>
        </div> */}
      </aside>

      {/* Contenido principal */}
      <div className="relative min-h-screen lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/80 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm hover:bg-slate-50 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Biblioteca / {activeItem.label}
              </p>
              <h2 className="mt-0.5 text-lg font-extrabold tracking-tight text-slate-900">
                {activeItem.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 sm:inline-flex sm:items-center sm:gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Interfaz activa
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-extrabold text-white shadow-md shadow-blue-200">
              A
            </div>
          </div>
        </header>

        {/* Área del módulo */}
        <main className="p-5 sm:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-500 p-6 text-white shadow-xl shadow-indigo-200/50 sm:p-9">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="mb-3 text-sm font-semibold text-white/75">
                    TU BIBLIOTECA DIGITAL
                  </p>
                  <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    ¡Hola! Bienvenido a BookSpace
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
                    Organiza, consulta y administra tu colección de libros
                    desde un solo lugar.
                  </p>
                </div>

                <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10 sm:flex">
                  <ActiveIcon size={40} />
                </div>
              </div>
            </div>

            {/* Placeholder: aquí se renderizarán los módulos reales */}

            {activeModule === "dashboard" ? (
              <Dashboard />
            ) : activeModule === "catalog" ? (
              <Catalog />
            ) : activeModule === "inventory" ? (
              <Inventory />
            ) : activeModule === "documentation" ? (
              <Documentation />
            ) : (
              <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${activeItem.color} text-white shadow-lg`}>
                    <ActiveIcon size={27} />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Módulo de {activeItem.label}
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      {activeItem.description}. Aquí se integrará el componente correspondiente.
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                      <Sparkles size={14} />
                      Pendiente de implementar
                    </span>
                  </div>
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}

export default App