import axios from "axios"

const API_URL = "http://192.168.1.187:5000/api"

export const getFeasibilities = async () => {
  return axios.get(`${API_URL}/feasibility`)
}

export const getFeasibilityById = async (id) => {
  return axios.get(`${API_URL}/feasibility/${id}`)
}

export const createFeasibility = async (data) => {
  return axios.post(`${API_URL}/feasibility`, data)
}

export const updateFeasibility = async (id, data) => {
  return axios.put(`${API_URL}/feasibility/${id}`, data)
}

