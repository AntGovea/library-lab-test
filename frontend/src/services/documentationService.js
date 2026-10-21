
import apiClient from "../api/api";

export async function getApiDocumentation() {
  const response = await apiClient.get("/api/docs");
  return response.data.data;
}
