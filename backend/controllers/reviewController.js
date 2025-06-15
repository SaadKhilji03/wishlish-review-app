const Review = require("../models/Review");

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment, anonymous } = req.body;

    const existing = await Review.findOne({
      product: productId,
      user: req.user.id,
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      product: productId,
      user: req.user.id,
      rating,
      comment,
      anonymous: !!anonymous, // ✅ ensure it's saved as boolean
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment, anonymous } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) return res.status(404).json({ message: "Review not found" });
    if (review.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    review.rating = rating;
    review.comment = comment;
    review.anonymous = !!anonymous; // ✅ update value

    await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || !review.user.equals(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized or not found" });
    }

    await review.remove();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminDeleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review removed by admin" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("product", "title")
      .populate("user", "username email");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
