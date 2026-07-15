import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, isAdmin, user, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const isOwner = isAdmin && user && (product.user === user._id || product.user?._id === user._id);

  return (
    <div className="border border-gray-150 rounded-xl shadow-sm p-4 bg-white flex flex-col justify-between hover:shadow-md transition duration-200">
      <div>
        <img
          src={product.productImage}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />

        <div className="flex justify-between items-start mt-3">
          <div>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full capitalize">
              {product?.category?.replace("-", " ")}
            </span>
            <p className="text-lg font-bold text-gray-900 mt-1">₹{product.categoryPrice}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-gray-400 capitalize block">
              {product?.brand?.replace("sea", "")}
            </span>
            {product.brandPrice && (
              <p className="text-xs text-gray-400 line-through">₹{product.brandPrice}</p>
            )}
          </div>
        </div>

        <h3 className="font-bold text-gray-805 mt-2 text-base text-gray-800 line-clamp-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">Stock: {product.quantity} units</p>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer transition text-center"
          onClick={() => navigate(`/product/${product._id}`)}
        >
          View Details
        </button>
        {isOwner && onEdit && (
          <button
            className="bg-green-50 hover:bg-green-100 text-green-600 text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer transition"
            onClick={() => onEdit(product)}
          >
            Edit
          </button>
        )}
        {isOwner && onDelete && (
          <button
            className="bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2 px-3 rounded-lg cursor-pointer transition"
            onClick={() => onDelete(product._id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
