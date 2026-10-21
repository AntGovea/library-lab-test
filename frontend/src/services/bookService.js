
import apiClient from "../api/api";
import apiEndpoints from "../constants/apiEndpoints";

export async function getBooks(search = "") {
  const response = await apiClient.get(apiEndpoints.books.list, {
    params: search.trim() ? { search: search.trim() } : {},
  });

  return response.data.data ?? [];
}

export async function getBookById(id) {
  const response = await apiClient.get(apiEndpoints.books.detail(id));
  return response.data.data ?? response.data;
}

export async function createBook(book) {
  return apiClient.post(apiEndpoints.books.create, book);
}

export async function updateBook(id, book) {
  return apiClient.put(apiEndpoints.books.update(id), book);
}

export async function deleteBook(id) {
  return apiClient.delete(apiEndpoints.books.delete(id));
}

export async function purchaseBook(id, quantity) {
  return apiClient.post(apiEndpoints.books.purchase(id), { quantity });
}
