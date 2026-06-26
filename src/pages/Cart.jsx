import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosConfig";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaMinus, FaArrowRight, FaShoppingBag } from "react-icons/fa";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Checkout modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/cart");
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, delta, currentQty) => {
    if (currentQty + delta < 1) {
      return handleRemoveItem(productId);
    }

    try {
      const res = await axios.post("/cart/add", { productId, quantity: delta });
      setCart(res.data.cart);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const res = await axios.delete(`/cart/item/${productId}`);
      setCart(res.data.cart);
      toast.info("Item removed from cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((acc, item) => {
      const price = Number(item.productId?.categoryPrice) || 0;
      return acc + price * item.quantity;
    }, 0);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!address || !city || !pincode || !phone || !notes) {
      return toast.error("All shipping fields are required");
    }
    if (phone.length !== 10) {
      return toast.error("Phone number must be 10 digits");
    }

    try {
      setCheckoutLoading(true);
      // Place orders sequentially for each cart item
      for (const item of cart.items) {
        if (!item.productId) continue;
        await axios.post(`/placeOrder/${item.productId._id}`, {
          address,
          city,
          pincode,
          phone,
          notes,
        });
      }

      // Clear the cart
      await axios.post("/cart/clear");
      toast.success("Checkout successful! All orders placed.");
      setIsModalOpen(false);
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading && !cart) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center">
          <FaShoppingBag size={48} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700">Your Cart is Empty</h2>
          <p className="text-gray-400 mt-1 max-w-sm">Looks like you haven't added any products to your cart yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="mt-6 bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.productId;
              if (!product) return null;
              return (
                <div
                  key={item._id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <img
                      src={product.productImage}
                      alt={product.name}
                      className="h-20 w-20 rounded-lg object-cover bg-gray-50 border"
                    />
                    <div>
                      <h3 className="font-bold text-gray-800 text-base line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-400 capitalize mt-0.5">{product.category}</p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">₹{product.categoryPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border rounded-lg p-1 bg-gray-50">
                      <button
                        onClick={() => handleUpdateQuantity(product._id, -1, item.quantity)}
                        className="p-1.5 hover:bg-white rounded transition text-gray-500 cursor-pointer"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="px-3.5 text-sm font-bold text-gray-700">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(product._id, 1, item.quantity)}
                        className="p-1.5 hover:bg-white rounded transition text-gray-500 cursor-pointer"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* Total item amount */}
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">₹{(Number(product.categoryPrice) * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Delete item */}
                    <button
                      onClick={() => handleRemoveItem(product._id)}
                      className="text-gray-400 hover:text-red-500 transition p-2 cursor-pointer"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-6">
            <h3 className="text-lg font-bold text-gray-800 border-b pb-3">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({items.length} items):</span>
                <span className="font-semibold text-gray-800">₹{calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping Fee:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-bold text-base text-gray-900">
                <span>Total Amount:</span>
                <span className="text-blue-600">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              Checkout Cart <FaArrowRight size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Shipping Information</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label htmlFor="checkout-address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Street address, building, apartment..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-pin" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    id="checkout-pin"
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="6 digits"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label htmlFor="checkout-notes" className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes</label>
                <textarea
                  id="checkout-notes"
                  required
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Any delivery instructions..."
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Cart total amount:</span>
                  <span className="font-bold text-blue-600">₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  disabled={checkoutLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition cursor-pointer"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? "Placing Orders..." : "Place Orders"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
