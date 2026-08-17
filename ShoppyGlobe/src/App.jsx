import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

// Lazy loading all components for code splitting
const Header = lazy(() => import("./components/Header"));
const ProductList = lazy(() => import("./components/ProductList"));
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./components/Checkout"));
const NotFound = lazy(() => import("./components/NotFound"));


// Loading fallback component to display while lazy-loaded components are being fetched
function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 w-full">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3"></div>
      <p className="text-gray-500 font-medium text-sm">Loading content...</p>
    </div>
  );
}


// Root layout component that includes the header and an outlet for nested routes
function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200" />}>
        <Header />
      </Suspense>
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}

// router configuration using React Router v6 with lazy-loaded components and error handling
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
        <Suspense fallback={<LoadingFallback />}>
          <Header />
        </Suspense>
        <main className="flex-grow">
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        </main>
      </div>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProductList />
            <Cart />
          </Suspense>
        ),
      },
      {
        path: "product/:id",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ProductDetail />
          </Suspense>
        ),
      },
      {
        path: "cart",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Cart />
          </Suspense>
        ),
      },
      {
        path: "checkout",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Checkout />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;