import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../services/api";

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({}); // clear on change
  };

  const validate = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = "Username is required";
    if (!form.email.trim()) errors.email = "Email is required";
    if (!form.password.trim()) {
      errors.password = "Password is required";
    } else {
      if (form.password.length < 6)
        errors.password = "Password must be at least 6 characters";
      if (!/[A-Z]/.test(form.password))
        errors.password = "Password must include an uppercase letter";
      if (!/[0-9]/.test(form.password))
        errors.password = "Password must include a number";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await API.post("/auth/register", form);
      const token = res.data.token;
      login(token);
      setAuthToken(token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bgDark text-white">
      <div className="bg-cardDark rounded-lg p-8 shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-bgDark text-white border border-gray-600 px-3 py-2 rounded"
            />
            {fieldErrors.username && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.username}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-bgDark text-white border border-gray-600 px-3 py-2 rounded"
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-bgDark text-white border border-gray-600 px-3 py-2 rounded"
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-accent hover:bg-indigo-700 text-white py-2 px-4 rounded"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
