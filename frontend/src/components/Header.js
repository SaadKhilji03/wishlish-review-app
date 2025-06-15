import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-cardDark text-white px-6 py-4 shadow-md flex items-center justify-between">
      <div className="text-lg font-semibold text-accent">
        🛍 Wishlist & Reviews
      </div>

      <nav className="space-x-4">
        <Link to="/" className="hover:text-accent">
          Home
        </Link>
        <Link to="/wishlist" className="hover:text-accent">
          Wishlist
        </Link>

        {user?.role === "admin" && (
          <Link to="/admin" className="hover:text-accent">
            Admin Panel
          </Link>
        )}

        {user ? (
          <>
            <span className="text-sm text-gray-400">
              <span className="text-white">{user.username}</span>
              {user.role === "admin" && (
                <span className="ml-1 text-gray-400">(admin)</span>
              )}
            </span>
            <button
              onClick={handleLogout}
              className="ml-4 bg-accent text-white px-3 py-1 rounded hover:bg-indigo-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-accent">
              Login
            </Link>
            <Link to="/register" className="hover:text-accent">
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
