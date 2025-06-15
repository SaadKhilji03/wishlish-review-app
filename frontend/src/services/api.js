import axios from "axios";

// ✅ Read API base URL from Vite environment variable
const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  console.error("❌ VITE_API_BASE_URL is not defined");
}

const API = axios.create({
  baseURL: baseURL || "http://localhost:5000/api", // e.g., https://wishlish-review-app.onrender.com/api
});

// ✅ Utility to set the token when user logs in
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;
