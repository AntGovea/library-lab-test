
const API_PREFIX = "/api";

const RESOURCE_PATHS = {
  books: `${API_PREFIX}/books`,
};

const apiEndpoints = {
  books: {
    list: RESOURCE_PATHS.books,
    create: RESOURCE_PATHS.books,

    detail: (id) =>
      `${RESOURCE_PATHS.books}/${encodeURIComponent(id)}`,

    update: (id) =>
      `${RESOURCE_PATHS.books}/${encodeURIComponent(id)}`,

    delete: (id) =>
      `${RESOURCE_PATHS.books}/${encodeURIComponent(id)}`,

    purchase: (id) =>
      `${RESOURCE_PATHS.books}/${encodeURIComponent(id)}/purchase`,
  },
};

export default apiEndpoints;
