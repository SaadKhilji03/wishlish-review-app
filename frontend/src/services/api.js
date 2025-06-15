import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setAuthToken = (token) => {
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export default API;
