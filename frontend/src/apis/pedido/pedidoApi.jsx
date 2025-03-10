// API utility functions for Pedido
import { apiRequest } from "../api";

const BASE_URL = "api/pedidos";

export const getAllPedidos = async (page = 1, limit = 10) => {
  const url = `${BASE_URL}?page=${page}&limit=${limit}`;

  try {
    return await apiRequest("GET", url);
  } catch (error) {
    console.error("Error fetching pedidos:", error);
    throw error; // Rethrow the error for better error handling
  }
};


// Get a single pedido by ID
export const getPedidoById = (id) => {
  return apiRequest("GET", `${BASE_URL}/${id}`);
};

// Create a new pedido
export const createPedido = (data) => {
  return apiRequest("POST", BASE_URL, data);
};

// Update an existing pedido
export const updatePedido = (id, data) => {
  return apiRequest("PUT", `${BASE_URL}/${id}`, data);
};

// Delete a pedido
export const deletePedido = (id) => {
  return apiRequest("DELETE", `${BASE_URL}/${id}`);
};