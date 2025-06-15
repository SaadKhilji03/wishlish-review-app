import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../services/api";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      const token = res.data.token;
      login(token);
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark text-white">
      <div className="bg-cardDark rounded-lg p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Log In</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-bgDark text-white border border-gray-600 px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-bgDark text-white border border-gray-600 px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
