import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function ProductDetail() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews");
      const productReviews = res.data.filter((r) => r.product._id === id);
      setReviews(productReviews);

      if (user?.id) {
        const mine = productReviews.find((r) => r.user._id === user.id);
        if (mine) {
          setMyReview(mine);
          setRating(mine.rating);
          setComment(mine.comment);
          setAnonymous(mine.anonymous || false);
        } else {
          setMyReview(null);
          setRating(5);
          setComment("");
          setAnonymous(false);
        }
      } else {
        setMyReview(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWishlist = async () => {
    if (!token) return;
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data.map((p) => p._id));
    } catch (err) {
      console.error(err);
    }
  };

  const isWishlisted = wishlist.includes(id);

  const toggleWishlist = async () => {
    try {
      const route = isWishlisted ? "/wishlist/remove" : "/wishlist/add";
      await API.post(route, { productId: id });
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      if (myReview) {
        await API.put(`/reviews/${myReview._id}`, {
          rating,
          comment,
          anonymous,
        });
      } else {
        await API.post("/reviews", {
          productId: id,
          rating,
          comment,
          anonymous,
        });
      }
      setMsg("Review saved!");
      fetchReviews();
    } catch (err) {
      console.error(err);
      setMsg("Error submitting review");
    }
  };

  const deleteReview = async () => {
    try {
      await API.delete(`/reviews/${myReview._id}`);
      setMsg("Review deleted");
      setMyReview(null);
      setRating(5);
      setComment("");
      setAnonymous(false);
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    if (token) fetchWishlist();
  }, []);

  if (!product) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{product.title}</h2>

      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <img
          src={product.image}
          alt={product.title}
          onError={(e) => (e.target.src = "/fallback.png")}
          className="rounded w-full md:w-1/2 object-cover max-h-[300px]"
        />
        <div>
          <p className="text-gray-300 mb-2">{product.description}</p>
          <p className="text-gray-400 mb-4">
            Average Rating: {product.avgRating || "—"}
          </p>

          {token ? (
            <button
              onClick={toggleWishlist}
              className={`px-4 py-2 rounded ${
                isWishlisted
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-accent hover:bg-indigo-700"
              }`}
            >
              {isWishlisted ? "Remove from Wishlist" : "♡ Add to Wishlist"}
            </button>
          ) : (
            <p className="text-sm text-gray-400 italic">
              Log in to add this product to your wishlist.
            </p>
          )}
        </div>
      </div>

      <hr className="border-gray-700 my-6" />

      <h3 className="text-2xl font-semibold mb-2">Reviews</h3>

      {reviews.length ? (
        <div className="space-y-4 mb-6">
          {reviews.map((r) => (
            <div key={r._id} className="bg-cardDark rounded p-4 shadow">
              <p className="text-gray-400 text-sm mb-1">
                {r.anonymous ? "Anonymous" : r.user.username || r.user.email} – ★{r.rating}
              </p>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">No reviews yet.</p>
      )}

      {token ? (
        <div className="bg-cardDark p-4 rounded shadow mt-4">
          <h3 className="text-xl font-bold mb-2">
            {myReview ? "Edit Your Review" : "Add a Review"}
          </h3>
          <form onSubmit={handleReviewSubmit}>
            <label className="block mb-2">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-bgDark text-white border border-gray-600 px-3 py-2 rounded mb-4"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>
                  {star}
                </option>
              ))}
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your comment"
              className="w-full bg-bgDark border border-gray-600 text-white rounded px-3 py-2 mb-4"
              rows={4}
              required
            />

            <label className="inline-flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span className="text-sm text-gray-300">
                Post review anonymously
              </span>
            </label>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="bg-accent px-4 py-2 rounded text-white hover:bg-indigo-700"
              >
                Submit Review
              </button>

              {myReview && (
                <button
                  type="button"
                  onClick={deleteReview}
                  className="bg-red-600 px-4 py-2 rounded text-white hover:bg-red-700"
                >
                  Delete Review
                </button>
              )}
            </div>
            {msg && <p className="text-green-400 mt-3">{msg}</p>}
          </form>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic mt-4">
          Log in to leave a review.
        </p>
      )}
    </div>
  );
}

export default ProductDetail;
