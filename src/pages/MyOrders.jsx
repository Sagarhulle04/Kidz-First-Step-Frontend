import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosConfig";
import { toast } from "react-toastify";
import { FaBoxOpen, FaRegCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaChevronRight } from "react-icons/fa";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/myOrders");
      setOrders(res.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <FaBoxOpen size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">No Orders Placed Yet</h2>
          <p className="text-gray-400 mt-1 max-w-sm">You haven't ordered any toys yet. Start browsing our catalogue!</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          >
            Browse Catalogue
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const product = order.product;
            const address = order.address;
            if (!product) return null;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100 hover:shadow-md transition duration-200"
              >
                {/* Product Detail Section */}
                <div className="p-6 flex-1 flex gap-4">
                  <img
                    src={product.productImage}
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex flex-col justify-between flex-1">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider capitalize">
                        {product.category}
                      </span>
                      <h3 className="font-extrabold text-gray-800 text-base mt-1 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Brand: {product.brand?.replace("sea", "")}</p>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-extrabold text-blue-600">₹{product.categoryPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Delivery Information Section */}
                <div className="p-6 md:w-80 bg-gray-50/50 flex flex-col justify-between text-xs text-gray-600 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <FaRegCalendarAlt className="text-gray-400" />
                      <span>Ordered On</span>
                    </div>
                    <p className="pl-5 text-gray-900 font-medium">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {address && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>Shipping Address</span>
                      </div>
                      <p className="pl-5 text-gray-900 leading-relaxed font-medium">
                        {address.address}, {address.city} - {address.pincode}
                      </p>
                    </div>
                  )}
                </div>

                {/* Status & Contact details */}
                <div className="p-6 md:w-60 flex flex-col justify-between text-xs text-gray-600 space-y-3">
                  {address && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                        <FaPhoneAlt className="text-gray-400" />
                        <span>Contact Info</span>
                      </div>
                      <p className="pl-5 text-gray-900 font-medium">{address.phone}</p>
                    </div>
                  )}

                  {address?.notes && (
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-700">Delivery Notes:</p>
                      <p className="text-gray-500 italic pl-1">{address.notes}</p>
                    </div>
                  )}

                  <div>
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
                      ● Status: Dispatched
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
