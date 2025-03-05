// API utility functions for Pedido
import { apiRequest } from "../api";

const BASE_URL = "api/pedidos";

// Get all pedidos with pagination
export const getAllPedidos = (page = 1, limit = 10) => {
  return apiRequest("GET", `${BASE_URL}?page=${page}&limit=${limit}`);
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