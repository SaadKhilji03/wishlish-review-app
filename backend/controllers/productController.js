const Product = require("../models/Product");
const Review = require("../models/Review");

// GET all products, optionally filter by rating
exports.getAllProducts = async (req, res) => {
  try {
    const minRating = parseFloat(req.query.minRating);

    // Step 1: Get all products
    let products = await Product.find();

    // Step 2: Get all average ratings
    const ratingStats = await Review.aggregate([
      { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
    ]);

    // Step 3: Map ratings to a lookup
    const ratingMap = {};
    ratingStats.forEach((r) => {
      ratingMap[r._id.toString()] = parseFloat(r.avgRating.toFixed(1));
    });

    // Step 4: Attach avgRating to each product
    let productsWithRatings = products.map((product) => {
      const avgRating = ratingMap[product._id.toString()] || null;
      return {
        ...product.toObject(),
        avgRating,
      };
    });

    // Step 5: Apply rating filter if needed
    if (!isNaN(minRating)) {
      productsWithRatings = productsWithRatings.filter(
        (p) => p.avgRating !== null && p.avgRating >= minRating
      );
    }

    res.json(productsWithRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET single product with average rating
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const reviews = await Review.find({ product: product._id });
    const avgRating = reviews.length
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "No reviews yet";

    res.json({ ...product.toObject(), avgRating });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const product = await Product.create({ title, description, image });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
