# ShoppyGlobe E-Commerce Application

ShoppyGlobe is a modern, responsive e-commerce web application built using **React**, **Vite**, **Redux Toolkit**, and **React Router**.

---------------------------------------------------------------------------------------------------

## Features

- **State Management (Redux Toolkit)**: Centralized state management for cart items (adding, removing, quantity updating, clearing) and global product search query filter.
- **Dynamic React Routing (`createBrowserRouter`)**: Dynamic routing with route parameters for product details (`/product/:id`), cart (`/cart`), checkout (`/checkout`), and a 404 Not Found page.
- **Product Search & Filtering**: Instant product filtering in `ProductList` driven by Redux state.
- **Performance Optimization**: Code splitting with `React.lazy` and `Suspense` for route components, along with `loading="lazy"` for images.
- **Responsive Styling**: Mobile-first responsive design powered by Tailwind CSS.

----------------------------------------------------------------------------------------------------

##  Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

----------------------------------------------------------------------------------------------------

##  Installation & Setup Instructions

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

### 3. Start the Development Server
Launch the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`).

----------------------------------------------------------------------------------------------------

## Building & Previewing for Production

### Build for Production
To create an optimized production build in the `dist` directory:
```bash
npm run build
```

## Project Structure

```
ShoppyGlobe/
├── src/
│   ├── components/       # Header, ProductList, ProductItem, ProductDetail, Cart, CartItem, Checkout, NotFound
│   ├── hooks/            # Custom React hooks (e.g. useFetchProducts)
│   ├── redux/            # Redux Store, cartSlice, and searchSlice
│   ├── App.jsx           # Router configuration with createBrowserRouter and React.lazy
│   ├── main.jsx          # Entry point wrapping App with Redux Provider
│   └── index.css         # Global Tailwind CSS styles
├── index.html            # Main HTML document
├── vite.config.js        # Vite build configuration
└── package.json          # Node dependencies and scripts
```

## GITHUB REPO 
     
    