# ShoppyGlobe E-Commerce Application

ShoppyGlobe is a full-stack, responsive e-commerce web application featuring a modern **React + Vite + Redux Toolkit** frontend and a secure **Node.js + Express + MongoDB** REST API backend.

---------------------------------------------------------------------------------------------------

## Features

### Frontend (React & Redux)
- **State Management (Redux Toolkit)**: Centralized state management for user authentication (JWT session persistence), shopping cart items (adding, removing, quantity updating, clearing), and global product search query filter.
- **Dynamic React Routing (`createBrowserRouter`)**: Client-side routing with nested routes and parameters for product details (`/product/:id`), cart (`/cart`), checkout (`/checkout`), user login & registration (`/login`), and a 404 Not Found page.
- **Product Search & Category Filtering**: Instant product filtering and category selection powered by Redux and custom React hooks.
- **Cart Sync & Persistence**: Guest cart persisted in `localStorage` and authenticated user cart synced seamlessly with MongoDB.
- **Performance Optimization**: Code splitting with `React.lazy` and `Suspense` for all route views, paired with `loading="lazy"` and `decoding="async"` for images.
- **Responsive Styling**: Modern, accessible, mobile-first design powered by Tailwind CSS.

### Backend (Node.js + Express + MongoDB)
- **RESTful API Architecture**: Modular architecture with routes, controllers, Mongoose models, and centralized error handling middleware.
- **Authentication & Security**: User registration and login using JWT (JSON Web Tokens) 
- **Product CRUD API**: Endpoints to list (with pagination, search, and category filter), fetch by ID, create, update, and delete products.
- **Cart Management API**: Authenticated endpoints to view, add, update, remove, and clear items from a user's MongoDB cart with automated orphan-product cleanup.
- **Database Seeding**: Automated seeding script to fetch ~194 products and populate MongoDB with schema validation.

----------------------------------------------------------------------------------------------------

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- **MongoDB** (Local MongoDB instance or MongoDB Atlas connection URI)

----------------------------------------------------------------------------------------------------

## Installation & Setup Instructions

Follow these steps to run the application locally:

### 1. Clone or Navigate to Project Directory
Navigate to the project root directory:
```bash
cd ShoppyGlobe
```

### 2. Install Dependencies
Install all required project dependencies:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the `ShoppyGlobe` root directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/shoppyglobe
PORT=5100
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1d
```

### 4. Start the Application

**Start the Express + MongoDB Backend:**
```bash
npm run server
```
*The backend server will run on `http://localhost:5100`.*

**In a separate terminal, start the Vite Frontend Dev Server:**
```bash
npm run dev
```
*Open your browser and navigate to `http://localhost:5173` (Vite proxies all `/api` requests to the backend).*

----------------------------------------------------------------------------------------------------

## API Endpoints Reference

### Authentication Endpoints
- `POST /api/register` — Register a new user 
- `POST /api/login` — Log in and receive JWT token 

### Product Endpoints
- `GET /api/products` — Retrieve list of products 
- `GET /api/products/:id` — Get single product details by MongoDB `_id`
- `GET /api/products/category-list` — Get list of distinct product categories
- `POST /api/products` — Create a new product
- `PUT /api/products/:id` — Update an existing product by ID
- `DELETE /api/products/:id` — Delete a product by ID

### Cart Endpoints (Protected — Requires `Authorization: Bearer <token>`)
- `GET /api/cart` — Fetch current user's cart populated with product details
- `POST /api/cart` — Add product to cart 
- `PUT /api/cart/:productId` — Update item quantity 
- `DELETE /api/cart/:productId` — Remove specific product from cart
- `DELETE /api/cart` — Clear entire cart for the authenticated user

----------------------------------------------------------------------------------------------------

## Building for Production

To create an optimized production build in the `dist` directory:
```bash
npm run build
```

----------------------------------------------------------------------------------------------------

## Project Structure

```
ShoppyGlobe/
├── server/
│   ├── controllers/      # authController, productController, cartController
│   ├── middleware/       # validate.js (JWT auth verification & request body validation)
│   ├── models/           # User.js, Product.js, Cart.js (Mongoose schemas)
│   ├── routes/           # Express router endpoints
│   ├── db.js             # MongoDB database connection
│   ├── seed.js           # Database seeding script
│   └── server.js         # Express app initialization, middleware & global error handling
├── src/
│   ├── components/       # Header, Home, ProductList, ProductItem, ProductDetail, Cart, CartItem, Checkout, Login, NotFound
│   ├── hooks/            # Custom React hooks (useFetchProducts)
│   ├── redux/            # store.js, authSlice.js, cartSlice.js, searchSlice.js
│   ├── App.jsx           # React Router v6 setup with createBrowserRouter and React.lazy
│   ├── main.jsx          # Application entry point with Redux Provider
│   └── index.css         # Global Tailwind CSS styles
├── screenshots/          # API & database snapshots
├── index.html            # Main HTML document
├── vite.config.js        # Vite build and /api proxy configuration
├── package.json          # Node dependencies and scripts
└── README.md             # Project documentation
```

----------------------------------------------------------------------------------------------------

## GITHUB REPO :{ https://github.com/amaansiddqui/ShoppyGlobe/tree/main }