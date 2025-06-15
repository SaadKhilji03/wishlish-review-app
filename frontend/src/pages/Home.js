import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const fetchProducts = async () => {
    try {
      const res = await API.get(
        `/products${filter ? `?minRating=${filter}` : ""}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    setCurrentPage(1);
  }, [filter]);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search)
  );

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  const changePage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">All Products</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <label className="text-sm mr-2">Filter by rating:</label>
          <select
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
            className="bg-cardDark border border-gray-600 text-white px-3 py-1 rounded"
          >
            <option value="">All</option>
            <option value="1">1★ & up</option>
            <option value="2">2★ & up</option>
            <option value="3">3★ & up</option>
            <option value="4">4★ & up</option>
            <option value="5">5★ only</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={handleSearch}
          className="bg-cardDark border border-gray-600 text-white px-4 py-2 rounded w-full md:w-1/3"
        />
      </div>

      {currentProducts.length === 0 ? (
        <p className="text-gray-400">No matching products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="bg-cardDark rounded-lg p-4 shadow-md hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.title}
                onError={(e) => (e.target.src = "/fallback.png")}
                className="w-full h-[150px] object-cover rounded"
              />
              <h4 className="mt-2 font-semibold">{product.title}</h4>
              <p className="text-gray-400 text-sm">
                Avg Rating: {product.avgRating || "—"}
              </p>
              <Link
                to={`/product/${product._id}`}
                className="inline-block mt-3 bg-accent text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >
                View Details
              </Link>
            </div>
          ))}
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

export default Home;
