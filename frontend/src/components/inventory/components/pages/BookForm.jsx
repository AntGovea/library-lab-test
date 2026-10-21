
import { useState } from "react";
import { validateBook } from "../../../../utils/bookValidation";

const emptyBook = {
  title: "",
  author: "",
  genre: "",
  isbn: "",
  publisher: "",
  publication_year: "",
  description: "",
  pages: "",
  language: "",
  price: "",
  stock_quantity: "",
  image_url: "",
};

const fields = [
  { name: "title", label: "Título", required: true },
  { name: "author", label: "Autor", required: true },
  { name: "genre", label: "Género", required: true },
  { name: "isbn", label: "ISBN" },
  { name: "publisher", label: "Editorial" },
  { name: "publication_year", label: "Año de publicación", type: "number" },
  { name: "pages", label: "Número de páginas", type: "number" },
  { name: "language", label: "Idioma" },
  { name: "price", label: "Precio", type: "number", required: true },
  {
    name: "stock_quantity",
    label: "Existencias",
    type: "number",
    required: true,
  },
  { name: "image_url", label: "URL de la imagen", type: "url" },
];

export default function BookForm({
  initialValues,
  onSubmit,
  isEditing = false,
  submitLabel = "Guardar libro",
}) {
  const [formData, setFormData] = useState(() => ({
    ...emptyBook,
    ...initialValues,
    publication_year: initialValues?.publication_year ?? "",
    pages: initialValues?.pages ?? "",
    price: initialValues?.price ?? "",
    stock_quantity: initialValues?.stock_quantity ?? "",
    isbn: initialValues?.isbn ?? "",
    publisher: initialValues?.publisher ?? "",
    description: initialValues?.description ?? "",
    language: initialValues?.language ?? "",
    image_url: initialValues?.image_url ?? "",
  }));

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateBook(formData);
    setErrors(validationErrors);
    setServerError("");

    if (Object.keys(validationErrors).length > 0) {
      const firstInvalidField = Object.keys(validationErrors)[0];
      document.getElementById(firstInvalidField)?.focus();
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim(),
      genre: formData.genre.trim(),
      isbn: formData.isbn.trim() || null,
      publisher: formData.publisher.trim() || null,
      publication_year:
        formData.publication_year === ""
          ? null
          : Number(formData.publication_year),
      description: formData.description.trim() || null,
      pages: formData.pages === "" ? null : Number(formData.pages),
      language: formData.language.trim() || null,
      price: Number(formData.price),
      stock_quantity: Number(formData.stock_quantity),
      image_url: formData.image_url.trim() || null,
    };

    setLoading(true);

    try {
      await onSubmit(payload);
    } catch (error) {
      const data = error?.response?.data;

      setServerError(
        data?.error?.message ||
          data?.message ||
          (typeof data?.error === "string" ? data.error : null) ||
          error?.message ||
          "No se pudo guardar el libro."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <label
              htmlFor={field.name}
              className="block text-sm font-medium"
            >
              {field.label}
              {field.required && (
                <span className="ml-1 text-red-500">*</span>
              )}
            </label>

            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              required={field.required || false}
              min={field.name === "stock_quantity" ? 0 : undefined}
              step={
                ["publication_year", "pages", "stock_quantity"].includes(
                  field.name
                )
                  ? 1
                  : field.name === "price"
                    ? "0.01"
                    : undefined
              }
              disabled={loading}
              aria-invalid={Boolean(errors[field.name])}
              aria-describedby={
                errors[field.name] ? `${field.name}-error` : undefined
              }
              className={`w-full rounded-lg border px-3 py-2 outline-none transition focus:ring-2 ${
                errors[field.name]
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
              }`}
            />

            {errors[field.name] && (
              <p
                id={`${field.name}-error`}
                role="alert"
                className="text-sm text-red-600"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="block text-sm font-medium">
          Descripción
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          disabled={loading}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
