import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrash, FaEye } from "react-icons/fa";
import { toast } from "react-toastify";

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("kidz-wishlist")) || [];
    setWishlist(savedWishlist);
  }, []);

  const handleRemove = (productId) => {
    const updated = wishlist.filter((item) => item._id !== productId);
    localStorage.setItem("kidz-wishlist", JSON.stringify(updated));
    setWishlist(updated);
    toast.info("Removed from Wishlist");
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <FaHeart size={28} className="text-red-500" />
        <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <FaHeart size={48} className="text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Your Wishlist is Empty</h2>
          <p className="text-gray-400 mt-1 max-w-sm">Tap the heart icon on any toy to add it to your wishlist.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          >
            Explore Toys
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="border border-gray-150 rounded-xl shadow-sm p-4 bg-white flex flex-col justify-between hover:shadow-md transition duration-200"
            >
              <div>
                <img
                  src={product.productImage}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="mt-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
                    {product.category?.replace("-", " ")}
                  </span>
                  <h3 className="font-bold text-gray-800 mt-2 text-base line-clamp-1" title={product.name}>
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-gray-900 mt-1">₹{product.categoryPrice}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                >
                  <FaEye /> View
                </button>
                <button
                  onClick={() => handleRemove(product._id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold p-2 rounded-lg cursor-pointer transition"
                  title="Remove"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
