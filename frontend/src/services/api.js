import axios from "axios";

const baseURL = process.env.REACT_APP_API_BASE_URL;

if (!baseURL) {
  console.error("❌ REACT_APP_API_BASE_URL is not defined");
}

const API = axios.create({
  baseURL: baseURL || "http://localhost:5000/api",
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
