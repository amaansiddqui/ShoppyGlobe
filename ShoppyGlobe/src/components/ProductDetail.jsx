import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";

export function ProductDetail({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchProductDetail() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product details (Status: ${response.status})`);
        }
        const data = await response.json();
        if (isMounted) {
          setProduct(data);
          setSelectedImage(data.thumbnail || (data.images && data.images[0]) || "");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (id) {
      fetchProductDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium text-lg">Loading product details...</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full text-center">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-md mx-auto shadow-sm">
          <div className="text-rose-500 font-bold text-xl mb-3">Product Not Found</div>
          <p className="text-gray-600 mb-6 text-sm">
            {error || "Unable to display details for this product."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-sm transition-colors no-underline"
          >
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const {
    title,
    description,
    price,
    rating,
    brand,
    category,
    stock,
    discountPercentage,
    images = [],
    warrantyInformation,
    shippingInformation,
    returnPolicy,
  } = product;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Back Button Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-purple-600 transition-colors no-underline"
        >
          ← Back to All Products
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Product Images Gallery */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="w-full h-96 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center overflow-hidden p-4">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={title}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-gray-400">No Image Available</span>
            )}
          </div>

          {images && images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 shrink-0 bg-gray-50 border-2 rounded-xl p-1 overflow-hidden transition-all cursor-pointer ${
                    selectedImage === imgUrl
                      ? "border-purple-600 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`${title} thumbnail ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Info */}
        <div className="lg:col-span-6 flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {category && (
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">
                  {category}
                </span>
              )}
              {brand && (
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md">
                  {brand}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {title}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mb-6">
              {rating > 0 && (
                <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-3 py-1 rounded-lg text-sm font-bold">
                  ★ {Number(rating).toFixed(1)}
                </div>
              )}
              {stock !== undefined && (
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-lg ${
                    stock > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                  }`}
                >
                  {stock > 0 ? `In Stock (${stock} available)` : "Out of Stock"}
                </span>
              )}
            </div>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-extrabold text-purple-600">
                ${Number(price).toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-2">
                Description
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {description}
              </p>
            </div>

            {/* Additional info tags */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 pt-4 border-t border-gray-100 text-xs text-gray-600 font-medium">
              {warrantyInformation && (
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block font-bold text-gray-800">Warranty:</span>
                  {warrantyInformation}
                </div>
              )}
              {shippingInformation && (
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block font-bold text-gray-800">Shipping:</span>
                  {shippingInformation}
                </div>
              )}
              {returnPolicy && (
                <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <span className="block font-bold text-gray-800">Return Policy:</span>
                  {returnPolicy}
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div>
            <button
              onClick={handleAddToCart}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base shadow-md transition-all active:scale-98 cursor-pointer ${
                added
                  ? "bg-emerald-600 text-white"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {added ? "Added to Cart ✓" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

ProductDetail.propTypes = {
  onAddToCart: PropTypes.func,
};

export default ProductDetail;
