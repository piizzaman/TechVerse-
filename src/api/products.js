import axios from "axios";
import demoProducts from "../data/products";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5001"}/api/products`;

function getAuthHeaders() {
  const token = localStorage.getItem("techverse-admin-token");
  return { Authorization: `Bearer ${token}` };
}

// The storefront remains explorable when the optional API/database is offline.
export async function getProducts() {
  try {
    const response = await axios.get(API_URL, { timeout: 5000 });
    return Array.isArray(response.data) && response.data.length ? response.data : demoProducts;
  } catch {
    return demoProducts;
  }
}

export async function getProduct(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`, { timeout: 5000 });
    return response.data;
  } catch {
    const product = demoProducts.find((item) => String(item.id) === String(id));
    if (!product) throw new Error("Product not found");
    return product;
  }
}

export async function createProduct(product) {
  const response = await axios.post(API_URL, product, { headers: getAuthHeaders() });
  return response.data;
}
export async function updateProduct(id, product) {
  const response = await axios.put(`${API_URL}/${id}`, product, { headers: getAuthHeaders() });
  return response.data;
}
export async function deleteProduct(id) {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
  return response.data;
}
