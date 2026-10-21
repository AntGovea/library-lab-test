
import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, Search } from "lucide-react";
import { getApiDocumentation } from "../services/documentationService";

const methodStyles = {
  GET: "bg-blue-100 text-blue-800",
  POST: "bg-green-100 text-green-800",
  PUT: "bg-amber-100 text-amber-800",
  PATCH: "bg-orange-100 text-orange-800",
  DELETE: "bg-red-100 text-red-800",
};

export default function Documentation() {
  const [documentation, setDocumentation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function loadDocumentation() {
    setLoading(true);
    setError("");

    try {
      const data = await getApiDocumentation();
      setDocumentation(data);
    } catch {
      setError(
        "No se pudo cargar la documentación. Verifica que el backend esté funcionando."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocumentation();
  }, []);

  const endpoints = (documentation?.endpoints ?? []).filter((endpoint) => {
    const text = [
      endpoint.group,
      endpoint.method,
      endpoint.path,
      endpoint.description,
    ]
      .join(" ")
      .toLowerCase();

    return text.includes(search.trim().toLowerCase());
  });

  const groups = [...new Set(endpoints.map((endpoint) => endpoint.group))];

  return (
    <main className="space-y-6 p-4 md:p-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-blue-600">
            <BookOpen size={22} />
            <span className="text-sm font-medium">Referencia técnica</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Documentación API
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Endpoints, parámetros y respuestas proporcionados por el backend.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDocumentation}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} />
          Actualizar
        </button>
      </header>

      {loading && (
        <p role="status" className="rounded-lg bg-gray-50 p-4 text-gray-600">
          Cargando documentación...
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          <p>{error}</p>
          <button
            type="button"
            onClick={loadDocumentation}
            className="font-medium underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && documentation && (
        <>
          <section className="rounded-xl border bg-white p-5">
            <h2 className="text-lg font-semibold">
              {documentation.info.title}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {documentation.info.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              <span className="rounded-md bg-gray-100 px-3 py-1">
                Versión {documentation.info.version}
              </span>
              <span className="rounded-md bg-gray-100 px-3 py-1">
                {endpoints.length} endpoints
              </span>
            </div>
          </section>

          <label className="flex items-center gap-3 rounded-lg border bg-white px-3">
            <Search size={18} className="text-gray-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por ruta, método o descripción..."
              className="w-full bg-transparent py-3 outline-none"
            />
          </label>

          {endpoints.length === 0 && (
            <p className="rounded-lg border p-5 text-gray-600">
              No se encontraron endpoints con esa búsqueda.
            </p>
          )}

          {groups.map((group) => (
            <section key={group} className="space-y-3">
              <h2 className="text-lg font-semibold">{group}</h2>

              {endpoints
                .filter((endpoint) => endpoint.group === group)
                .map((endpoint) => (
                  <article
                    key={`${endpoint.method}-${endpoint.path}`}
                    className="overflow-hidden rounded-xl border bg-white"
                  >
                    <div className="flex flex-wrap items-center gap-3 p-4">
                      <span
                        className={`rounded-md px-3 py-1 text-xs font-bold ${
                          methodStyles[endpoint.method] ??
                          "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {endpoint.method}
                      </span>

                      <code className="break-all text-sm font-semibold">
                        {endpoint.path}
                      </code>
                    </div>

                    <div className="space-y-4 border-t p-4">
                      <p className="text-sm text-gray-700">
                        {endpoint.description}
                      </p>

                      {endpoint.params?.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-sm font-semibold">
                            Parámetros de ruta
                          </h3>
                          {endpoint.params.map((param) => (
                            <p
                              key={param.name}
                              className="text-sm text-gray-600"
                            >
                              <code>{param.name}</code>
                              {param.required ? " (obligatorio)" : " (opcional)"}
                              {param.example && ` — Ejemplo: ${param.example}`}
                            </p>
                          ))}
                        </div>
                      )}

                      {endpoint.query?.length > 0 && (
                        <div>
                          <h3 className="mb-2 text-sm font-semibold">
                            Parámetros de consulta
                          </h3>
                          {endpoint.query.map((param) => (
                            <div key={param.name} className="mb-2 text-sm">
                              <p>
                                <code>{param.name}</code>
                                {param.required
                                  ? " (obligatorio)"
                                  : " (opcional)"}
                              </p>
                              <p className="text-gray-600">
                                {param.description}
                              </p>
                              {param.example && (
                                <p className="text-gray-500">
                                  Ejemplo: {param.example}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {endpoint.bodyExample && (
                        <div>
                          <h3 className="mb-2 text-sm font-semibold">
                            Ejemplo de cuerpo JSON
                          </h3>
                          <pre className="overflow-x-auto rounded-lg bg-gray-950 p-4 text-xs text-green-300">
                            {JSON.stringify(endpoint.bodyExample, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div>
                        <h3 className="mb-2 text-sm font-semibold">
                          Respuestas
                        </h3>
                        <div className="space-y-2">
                          {endpoint.responses?.map((response) => (
                            <div
                              key={response.status}
                              className="flex flex-wrap items-start gap-3 text-sm"
                            >
                              <code className="min-w-10 font-bold">
                                {response.status}
                              </code>
                              <span className="text-gray-600">
                                {response.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
            </section>
          ))}
        </>
      )}
    </main>
  );
}
