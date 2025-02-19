import axios from "axios";

const API_URL = "http://localhost:5000/api/checkins";

export const getCheckins = async () => {
  return axios.get(API_URL);
};

export const getCheckinById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const createCheckin = async (data) => {
  return axios.post(API_URL, data);
};

export const updateCheckin = async (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteCheckin = async (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
