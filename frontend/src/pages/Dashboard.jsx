
import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Database,
  Search,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";

const sections = [
  {
    title: "CRUD de libros",
    icon: BookOpen,
    tasks: [
      "Registrar un libro con datos válidos.",
      "Comprobar que se genera un ID con el formato esperado.",
      "Buscar por título, autor, ISBN u otros campos admitidos.",
      "Editar un libro y comprobar que los cambios se guardan.",
      "Eliminar un libro y comprobar que desaparece del catálogo.",
    ],
  },
  {
    title: "Validaciones y errores",
    icon: ShieldCheck,
    tasks: [
      "Intentar registrar un libro sin campos obligatorios.",
      "Probar un año fuera del rango permitido.",
      "Intentar registrar o editar un ISBN duplicado.",
      "Buscar un ID mal formado y comprobar el 400.",
      "Buscar un ID válido inexistente y comprobar el 404.",
    ],
  },
  {
    title: "Base de datos e inventario",
    icon: Database,
    tasks: [
      "Comprobar que el backend se conecta a PostgreSQL.",
      "Verificar que las operaciones persisten los datos.",
      "Probar una compra con stock suficiente.",
      "Probar una compra con stock insuficiente, si está implementada.",
    ],
  },
  {
    title: "Pruebas y documentación",
    icon: Search,
    tasks: [
      "Verificar GET /health y GET /ready.",
      "Consultar GET /api/docs.",
      "Revisar las respuestas de error en Postman.",
      "Ejecutar las pruebas automatizadas disponibles.",
    ],
  },
];

export default function Dashboard() {
  const [completed, setCompleted] = useState([]);

  const allTasks = sections.flatMap((section) => section.tasks);
  const progress = Math.round(
    (completed.length / allTasks.length) * 100
  );

  function toggleTask(task) {
    setCompleted((previous) =>
      previous.includes(task)
        ? previous.filter((item) => item !== task)
        : [...previous, task]
    );
  }

  return (
    <main className="space-y-6 p-4 md:p-8">
      <header>
        <p className="text-sm font-medium text-blue-600">
          Panel del proyecto
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Guía rápida para demostrar el funcionamiento del sistema de libros.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-semibold">Preparación de la demostración</h2>
            <p className="mt-1 text-sm text-gray-600">
              Marca cada prueba cuando la hayas ejecutado.
            </p>
          </div>
          <span className="text-xl font-bold">{progress}%</span>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100"
          role="progressbar"
          aria-label="Progreso de pruebas"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-gray-500">
          {completed.length} de {allTasks.length} pruebas completadas
        </p>
      </section>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const sectionCompleted = section.tasks.filter((task) =>
            completed.includes(task)
          ).length;

          return (
            <section
              key={section.title}
              className="rounded-xl border bg-white p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
                  <Icon size={22} />
                </div>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="text-xs text-gray-500">
                    {sectionCompleted}/{section.tasks.length} completadas
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {section.tasks.map((task) => (
                  <label
                    key={task}
                    className="flex cursor-pointer items-start gap-3 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={completed.includes(task)}
                      onChange={() => toggleTask(task)}
                      className="mt-1 accent-blue-600"
                    />
                    <span
                      className={
                        completed.includes(task)
                          ? "text-gray-400 line-through"
                          : "text-gray-700"
                      }
                    >
                      {task}
                    </span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-xl border border-blue-200 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <ShoppingCart className="mt-1 text-blue-700" size={22} />
          <div>
            <h2 className="font-semibold text-blue-950">
              Orden sugerido para la demostración
            </h2>
            <p className="mt-2 text-sm text-blue-900">
              Mostrar el catálogo, registrar un libro, buscarlo, editarlo,
              demostrar las validaciones, comprobar el manejo de errores y
              finalizar con las pruebas de inventario que estén implementadas.
            </p>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <CheckCircle2 size={16} />
        <span>
          Las verificaciones son manuales: marcar una casilla no ejecuta una
          prueba automáticamente.
        </span>
      </div>
    </main>
  );
}
