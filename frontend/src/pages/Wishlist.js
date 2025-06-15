import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function Wishlist() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data);
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await API.post("/wishlist/remove", { productId });
      fetchWishlist();
    } catch (err) {
      console.error("Failed to remove from wishlist", err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchWishlist();
    }
  }, [token]);

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-400">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-cardDark rounded-lg p-4 shadow-md hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.title}
                onError={(e) => (e.target.src = "/fallback.png")}
                className="w-full h-40 object-cover rounded"
              />
              <h4 className="mt-2 font-semibold">{product.title}</h4>
              <div className="flex flex-col gap-2 mt-4">
                <Link
                  to={`/product/${product._id}`}
                  className="bg-accent text-white px-3 py-1 rounded hover:bg-indigo-700 text-center"
                >
                  View
                </Link>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
