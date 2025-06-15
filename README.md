# Wishlist & Reviews App

A full-stack MERN application where users can browse products, add items to their wishlist, and leave reviews with optional anonymity. Admins can manage reviews and products directly from a custom dashboard.

---

## 🌐 Live Demo
- **Frontend (Vercel):** https://wishlist-review-app.vercel.app/
- **Backend (Render):** https://wishlist-review-app.onrender.com/api

---

## 🚀 Features

### 👤 User
- Register and login with JWT authentication
- View all products and individual product pages
- Add/remove products from wishlist
- Leave reviews (optionally anonymous)
- See all public reviews for any product

### 🛠 Admin
- Access protected Admin Panel
- View, filter, and delete reviews
- Add new products
- Delete products

### 🛒 Products
- 25 curated tech gadgets
- Each with a title, description, and image

### ❤️ Reviews
- Star rating system (1–5)
- Display average rating per product
- Reviews are tied to users and support anonymity

### 📌 Wishlist
- Each user can maintain a list of favorite products
- Stored in a separate Wishlist model

---

## 📁 Folder Structure

```
📦 root
├── frontend          # React + Tailwind client
├── backend           # Express.js + MongoDB API
└── README.md         # This file
```

---

## 🔧 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/your-username/wishlist-reviews-app.git
cd wishlist-reviews-app
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env # Fill in your MongoDB URI and JWT secret
npm run seed          # Optional: seeds realistic data (users, products, reviews)
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in `frontend/`:
```env
REACT_APP_API_BASE_URL= https://wishlist-review-app.vercel.app/api || http://localhost:5000/api
```
Then run:
```bash
npm run dev
```

---

## 🧪 Default Credentials (for testing)

### Admin
```
Email: admin@example.com
Password: Password123
```

### User
```
Email: john.doe@example.com
Password: Password123
```

---

### 📬 API Documentation

You can import the full API in Postman using this collection:  
[Download WishlistReviewAPI.json](./WishlistReviewAPI.json)

## 📦 Tech Stack

- **Frontend:** React, TailwindCSS, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT
- **Deployment:** Vercel (frontend) + Render (backend)

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first.

---

## 📄 License
[MIT](LICENSE)
