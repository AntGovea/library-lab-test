
import {
  BookOpen,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";

const actions = {
  list: {
    title: "Ver inventario",
    description: "Consulta los libros registrados y sus existencias.",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-600",
  },
  create: {
    title: "Agregar libro",
    description: "Registra un nuevo libro en la biblioteca.",
    icon: PlusCircle,
    color: "from-emerald-500 to-teal-600",
  },
  edit: {
    title: "Editar libro",
    description: "Actualiza los datos de un libro existente.",
    icon: Pencil,
    color: "from-violet-500 to-purple-600",
  },
  delete: {
    title: "Eliminar libro",
    description: "Busca y elimina un libro del inventario.",
    icon: Trash2,
    color: "from-rose-500 to-red-600",
  },
};

export default function InventoryActionCard({ action, onClick }) {
  const item = actions[action];

  if (!item) return null;

  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white transition group-hover:scale-105`}
      >
        <Icon size={23} />
      </div>

      <h3 className="font-semibold text-slate-800">
        {item.title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {item.description}
      </p>

      <span className="mt-4 inline-block text-sm font-semibold text-violet-600">
        Abrir acción →
      </span>
    </button>
  );
}
