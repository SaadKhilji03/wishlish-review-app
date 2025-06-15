import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminPanel() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const [newProduct, setNewProduct] = useState({ title: "", description: "", image: "" });
  const [productMsg, setProductMsg] = useState("");

  const fetchAll = async () => {
    const [reviewRes, productRes] = await Promise.all([
      API.get("/reviews"),
      API.get("/products"),
    ]);
    setReviews(reviewRes.data);
    setProducts(productRes.data);
  };

  const handleReviewDelete = async (id) => {
    await API.delete(`/reviews/admin/${id}`);
    setMsg("Review deleted.");
    fetchAll();
  };

  const handleProductDelete = async (id) => {
    await API.delete(`/products/${id}`);
    setProductMsg("Product deleted.");
    fetchAll();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filteredReviews = reviews.filter(
    (r) =>
      r.user.email.toLowerCase().includes(search) ||
      r.product.title.toLowerCase().includes(search)
  );

  const indexOfLast = currentPage * reviewsPerPage;
  const indexOfFirst = indexOfLast - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const { title, description, image } = newProduct;
    if (!title || !description || !image) {
      setProductMsg("All fields are required.");
      return;
    }

    try {
      await API.post("/products", newProduct);
      setProductMsg("Product added.");
      setNewProduct({ title: "", description: "", image: "" });
      fetchAll();
    } catch (err) {
      setProductMsg("Error adding product.");
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
    } else {
      fetchAll();
    }
  }, [token, user]);

  return (
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      {/* ADD PRODUCT */}
      <div className="bg-cardDark p-6 rounded shadow mb-10">
        <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
        {productMsg && <p className="text-green-400 mb-3">{productMsg}</p>}
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            className="bg-bgDark border border-gray-600 text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            className="bg-bgDark border border-gray-600 text-white px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="bg-bgDark border border-gray-600 text-white px-4 py-2 rounded"
          />
          <button
            type="submit"
            className="bg-accent hover:bg-indigo-700 text-white px-4 py-2 rounded col-span-full md:col-span-1"
          >
            Add Product
          </button>
        </form>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-3">All Products</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p._id} className="bg-cardDark rounded p-4 shadow flex flex-col gap-2">
              <img src={p.image} alt={p.title} className="h-32 object-cover rounded" />
              <h4 className="font-bold">{p.title}</h4>
              <p className="text-sm text-gray-400">{p.description}</p>
              <button
                onClick={() => handleProductDelete(p._id)}
                className="bg-red-600 hover:bg-red-700 text-white py-1 rounded mt-auto"
              >
                Delete Product
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <h3 className="text-2xl font-bold mb-3">Moderate Reviews</h3>
      {msg && <p className="text-green-400 mb-3">{msg}</p>}

      <input
        type="text"
        placeholder="Search by user or product"
        value={search}
        onChange={handleSearch}
        className="bg-cardDark border border-gray-600 text-white px-4 py-2 rounded mb-4 w-full md:w-1/2"
      />

      {currentReviews.length === 0 ? (
        <p className="text-gray-400">No matching reviews found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-cardDark rounded-lg shadow-md text-sm">
            <thead>
              <tr className="text-left bg-bgDark border-b border-gray-700">
                <th className="p-3">Product</th>
                <th className="p-3">User</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Comment</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReviews.map((r) => (
                <tr key={r._id} className="border-b border-gray-700">
                  <td className="p-3">{r.product.title}</td>
                  <td className="p-3">{r.user.email}</td>
                  <td className="p-3">{r.rating}★</td>
                  <td className="p-3">{r.comment}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleReviewDelete(r._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-accent text-white"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
