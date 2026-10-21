
import { useState } from "react";
import {
  ArrowLeft,
  Boxes,
  LayoutDashboard,
} from "lucide-react";

import InventoryActionCard from "./components/InventoryActionCard";
import BookList from "./components/pages/BookList";
import CreateBook from "./components/pages/CreateBook";
import EditBook from "./components/pages/EditBook";
import DeleteBook from "./components/pages/DeleteBook";

const views = {
  list: BookList,
  create: CreateBook,
  edit: EditBook,
  delete: DeleteBook,
};

export default function Inventory() {
  const [activeView, setActiveView] = useState("menu");

  const ActiveComponent = views[activeView];

  function goBack() {
    setActiveView("menu");
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
            <Boxes size={25} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Gestión de inventario
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Administra los libros de la biblioteca.
            </p>
          </div>
        </div>

        {activeView !== "menu" && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeft size={16} />
            Menú de inventario
          </button>
        )}
      </div>

      {/* Menú de acciones */}
      {activeView === "menu" ? (
        <>
          <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
            <LayoutDashboard size={28} />

            <h2 className="mt-4 text-xl font-bold">
              ¿Qué deseas hacer?
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-violet-100">
              Consulta el inventario, registra nuevos libros,
              actualiza información o elimina registros existentes.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <InventoryActionCard
              action="list"
              onClick={() => setActiveView("list")}
            />

            <InventoryActionCard
              action="create"
              onClick={() => setActiveView("create")}
            />

            <InventoryActionCard
              action="edit"
              onClick={() => setActiveView("edit")}
            />

            <InventoryActionCard
              action="delete"
              onClick={() => setActiveView("delete")}
            />
          </div>
        </>
      ) : (
        /* Pantalla seleccionada */
        ActiveComponent && (
          <ActiveComponent onBack={goBack} />
        )
      )}
    </div>
  );
}
