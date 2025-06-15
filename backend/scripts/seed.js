const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");

const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist"); // if applicable, or you may embed lists

dotenv.config({ path: "../.env" });

const reviewMessages = [
  "Amazing quality, worth every penny!",
  "Very satisfied with this product.",
  "Works exactly as advertised.",
  "Could be better, but gets the job done.",
  "I love it — using it every day.",
  "Delivery was fast and packaging was great.",
  "Five stars for functionality and price!",
  "Not bad, but there are better alternatives.",
  "Highly recommend to anyone on the fence.",
  "Will definitely buy again from this brand."
];

const sampleProducts = [
  {
    title: "Wireless Bluetooth Earbuds",
    description: "High-quality earbuds with noise cancellation and 24-hour battery life.",
    image: "https://m.media-amazon.com/images/I/61WgL6bihLL._AC_SL1500_.jpg",
  },
  {
    title: "Smart LED Light Strip",
    description: "Customizable RGB LED strip compatible with Alexa and Google Assistant.",
    image: "https://m.media-amazon.com/images/I/71F0Q5xuk8L._AC_SL1500_.jpg",
  },
  {
    title: "Portable Phone Charger 10000mAh",
    description: "Slim, fast-charging power bank with dual USB output.",
    image: "https://m.media-amazon.com/images/I/61vUeBvIbGL._AC_SL1500_.jpg",
  },
  {
    title: "Ergonomic Wireless Mouse",
    description: "Silent click, adjustable DPI, and long battery life.",
    image: "https://m.media-amazon.com/images/I/61iQL3j-D-L._AC_SL1500_.jpg",
  },
  {
    title: "Laptop Cooling Pad",
    description: "5 quiet fans with adjustable height settings and LED lighting.",
    image: "https://m.media-amazon.com/images/I/71ikDsD5fWL._AC_SL1500_.jpg",
  },
  {
    title: "USB-C Hub Adapter",
    description: "6-in-1 hub with HDMI, USB 3.0, SD card reader, and more.",
    image: "https://m.media-amazon.com/images/I/71W+0jl9mOL._AC_SL1500_.jpg",
  },
  {
    title: "Mechanical Gaming Keyboard",
    description: "RGB backlit keyboard with blue switches for tactile feedback.",
    image: "https://m.media-amazon.com/images/I/81Q75oHYtHL._AC_SL1500_.jpg",
  },
  {
    title: "Noise Cancelling Headphones",
    description: "Over-ear design with active noise cancellation and deep bass.",
    image: "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
  },
  {
    title: "Smart Fitness Tracker Band",
    description: "Heart rate monitor, step counter, and sleep tracking included.",
    image: "https://m.media-amazon.com/images/I/61FS2HHU6GL._AC_SL1500_.jpg",
  },
  {
    title: "Wireless Charging Stand",
    description: "Fast Qi-certified charger compatible with iPhone and Android.",
    image: "https://m.media-amazon.com/images/I/61hKZfFq+8L._AC_SL1500_.jpg",
  },
  {
    title: "1080p Web Camera with Microphone",
    description: "Plug-and-play webcam with wide angle and HD quality.",
    image: "https://m.media-amazon.com/images/I/61YvYaZsZ-L._AC_SL1500_.jpg",
  },
  {
    title: "Portable Bluetooth Speaker",
    description: "Waterproof, shockproof speaker with 12-hour battery.",
    image: "https://m.media-amazon.com/images/I/71dU+a1HszL._AC_SL1500_.jpg",
  },
  {
    title: "LED Desk Lamp with USB Port",
    description: "Adjustable brightness with touch control and charging port.",
    image: "https://m.media-amazon.com/images/I/61lvbTk3Y3L._AC_SL1500_.jpg",
  },
  {
    title: "Smart Wi-Fi Plug",
    description: "Control appliances remotely using voice or phone.",
    image: "https://m.media-amazon.com/images/I/61uN2STs1dL._AC_SL1500_.jpg",
  },
  {
    title: "Mini Projector",
    description: "Compact projector for movies, gaming, and presentations.",
    image: "https://m.media-amazon.com/images/I/71I5G0kzMQL._AC_SL1500_.jpg",
  },
  {
    title: "Adjustable Laptop Stand",
    description: "Aluminum stand with cooling and ergonomic tilt.",
    image: "https://m.media-amazon.com/images/I/61LtuGzX3pL._AC_SL1500_.jpg",
  },
  {
    title: "Smart Home Security Camera",
    description: "1080p camera with motion detection and night vision.",
    image: "https://m.media-amazon.com/images/I/618F3vI9v0L._AC_SL1500_.jpg",
  },
  {
    title: "USB Rechargeable Bike Light",
    description: "Ultra-bright front and rear lights for night safety.",
    image: "https://m.media-amazon.com/images/I/71uJpxT46ML._AC_SL1500_.jpg",
  },
  {
    title: "Electric Milk Frother",
    description: "Quickly froths milk for coffee, latte, or cappuccino.",
    image: "https://m.media-amazon.com/images/I/61Lg08-OxkL._AC_SL1500_.jpg",
  },
  {
    title: "Digital Kitchen Scale",
    description: "High-precision food scale with tare and auto-off.",
    image: "https://m.media-amazon.com/images/I/61IlYbIvN2L._AC_SL1500_.jpg",
  },
  {
    title: "Adjustable Phone Tripod",
    description: "Flexible tripod with Bluetooth remote and clamp.",
    image: "https://m.media-amazon.com/images/I/71Lk3iMD8uL._AC_SL1500_.jpg",
  },
  {
    title: "HDMI to VGA Adapter",
    description: "Connect HDMI devices to VGA projectors or monitors.",
    image: "https://m.media-amazon.com/images/I/61IzXdsKx-L._AC_SL1500_.jpg",
  },
  {
    title: "Foldable Bluetooth Keyboard",
    description: "Ultra-portable keyboard for tablets and smartphones.",
    image: "https://m.media-amazon.com/images/I/61ZPgPSbiKL._AC_SL1500_.jpg",
  },
  {
    title: "Silicone Cable Organizer",
    description: "Stick-on clips to keep cables tangle-free and tidy.",
    image: "https://m.media-amazon.com/images/I/61+yHjvwr6L._AC_SL1500_.jpg",
  },
  {
    title: "Magnetic Car Mount for Phone",
    description: "Securely mounts your phone on car vents with magnets.",
    image: "https://m.media-amazon.com/images/I/61HxGcAB8NL._AC_SL1500_.jpg",
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Wishlist.deleteMany({}),
  ]);
  console.log("Cleared collections");

  const pwdHash = await bcrypt.hash("Password123", 10);

  const users = [];

  // Admin
  users.push(await User.create({
    email: "admin@example.com",
    password: pwdHash,
    username: "Saad",
    role: "admin",
  }));

  // Regular users
  for (let i = 1; i <= 14; i++) {
    const firstName = faker.person.firstName().toLowerCase();
    const lastName = faker.person.lastName().toLowerCase();
    users.push(await User.create({
      email: `${firstName}.${lastName}@example.com`,
      password: pwdHash,
      username: `${firstName}_${lastName}`,
      role: "user",
    }));
  }
  console.log("Created 15 users");

  // Products
  const products = [];
  for (let i = 0; i < sampleProducts.length; i++) {
    products.push(await Product.create(sampleProducts[i]));
  }
  console.log("Created 25 products");

  // Reviews
  const reviews = [];
  for (const product of products) {
    const count = faker.number.int({ min: 3, max: 8 });
    for (let i = 0; i < count; i++) {
      const user = faker.helpers.arrayElement(users.filter(u => u.role === "user"));
      reviews.push({
        product: product._id,
        user: user._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.helpers.arrayElement(reviewMessages),
        anonymous: faker.datatype.boolean(),
      });
    }
  }
  await Review.insertMany(reviews);
  console.log("Created reviews");

  // Wishlists
  for (const user of users.filter(u => u.role === "user")) {
    const productIds = faker.helpers.shuffle(products).slice(0, faker.number.int({ min: 5, max: 10 })).map(p => p._id);
    await Wishlist.create({ user: user._id, products: productIds });
  }
  console.log("Created wishlists");

  console.log("✅ Seed complete");
  await mongoose.disconnect();
}

seed().catch(console.error);