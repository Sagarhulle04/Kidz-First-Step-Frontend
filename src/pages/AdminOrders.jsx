import React, { useEffect, useState } from "react";
import axios from "../services/axiosConfig";
import { toast } from "react-toastify";
import { FaBoxOpen, FaRegCalendarAlt, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaEnvelope } from "react-icons/fa";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/orders");
      setOrders(res.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch customer orders");
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track all orders placed by customers for your products</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <FaBoxOpen size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">No Orders Received Yet</h2>
          <p className="text-gray-400 mt-1 max-w-sm">When customers purchase your toys, they will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const product = order.product;
            const address = order.address;
            const customer = order.user;
            if (!product) return null;

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 hover:shadow-md transition duration-200"
              >
                {/* Customer Info Section */}
                <div className="p-6 lg:w-72 bg-blue-50/20 flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer Profile</h4>
                    {customer ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                            {customer.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                              <FaUser size={10} className="text-gray-400" /> {customer.name}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
                              <FaEnvelope size={10} className="text-gray-400" /> {customer.email}
                            </p>
                          </div>
                        </div>
                        <span className="inline-block text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full capitalize">
                          Gender: {customer.gender}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Anonymous Customer</p>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                      <FaRegCalendarAlt className="text-gray-400" />
                      <span>Order Date</span>
                    </div>
                    <p className="pl-5 text-gray-900 mt-1">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

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
                      <h3 className="font-extrabold text-gray-800 text-base mt-1 line-clamp-2">{product.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Brand: {product.brand?.replace("sea", "")}</p>
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-lg font-extrabold text-blue-600">Earnings: ₹{product.categoryPrice}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping & Delivery Information Section */}
                <div className="p-6 lg:w-80 flex flex-col justify-between text-xs text-gray-600 space-y-3">
                  {address && (
                    <>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                          <FaMapMarkerAlt className="text-gray-400" />
                          <span>Delivery Address</span>
                        </div>
                        <p className="pl-5 text-gray-900 leading-relaxed font-medium">
                          {address.address}, {address.city} - {address.pincode}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                          <FaPhoneAlt className="text-gray-400" />
                          <span>Contact Number</span>
                        </div>
                        <p className="pl-5 text-gray-900 font-medium">{address.phone}</p>
                      </div>

                      {address.notes && (
                        <div className="space-y-1">
                          <p className="font-semibold text-gray-700">Notes from Customer:</p>
                          <p className="text-gray-500 italic pl-1">{address.notes}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
