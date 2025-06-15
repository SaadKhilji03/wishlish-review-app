const express = require("express");
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  adminDeleteReview,
} = require("../controllers/reviewController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.get("/", getAllReviews);
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);
router.delete("/admin/:id", authMiddleware, adminMiddleware, adminDeleteReview);

module.exports = router;
