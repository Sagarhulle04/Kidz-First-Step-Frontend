import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { allProducts } from "../store/productSlice";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const token = localStorage.getItem("kidz-app");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const products = useSelector((state) => state.product.allProducts);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/allProducts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(allProducts(res.data.products));
    } catch (error) {
      console.log(error);

      // 401 error is handled by axios interceptor
      if (error.response?.status !== 401) {
        toast.error(
          error.response?.data?.message || "Unable to fetch products",
        );
      }
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchProducts();
  }, [token, navigate]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-8">Featured Products</h1>

      {products?.length === 0 ? (
        <h2 className="text-center text-gray-500">No products available.</h2>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
