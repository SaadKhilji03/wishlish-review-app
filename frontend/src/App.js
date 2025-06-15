import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";

import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { setAuthToken } from "./services/api";

function App() {
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      setAuthToken(token); // applies token to all API requests
    }
  }, [token]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
