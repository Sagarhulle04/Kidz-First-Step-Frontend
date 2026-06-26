import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../services/axiosConfig";
import { particularProduct } from "../store/productSlice";
import { toast } from "react-toastify";
import { FaHeart, FaRegHeart, FaArrowLeft, FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const product = useSelector((store) => store.product.currentProduct);
  const user = useSelector((store) => store.user);

  const [loading, setLoading] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  // Buy Now modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [orderLoading, setOrderLoading] = useState(false);

  async function fetchProduct() {
    try {
      setLoading(true);
      const res = await axios.get(`/fetchProduct/${id}`);
      dispatch(particularProduct(res.data.product));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProduct();

    // Check wishlist status from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem("kidz-wishlist")) || [];
    setInWishlist(savedWishlist.some((item) => item._id === id));
  }, [id]);

  const toggleWishlist = () => {
    let savedWishlist = JSON.parse(localStorage.getItem("kidz-wishlist")) || [];
    if (inWishlist) {
      savedWishlist = savedWishlist.filter((item) => item._id !== id);
      toast.info("Removed from Wishlist");
    } else {
      savedWishlist.push(product);
      toast.success("Added to Wishlist!");
    }
    localStorage.setItem("kidz-wishlist", JSON.stringify(savedWishlist));
    setInWishlist(!inWishlist);
  };

  const handleAddToCart = async () => {
    try {
      await axios.post("/cart/add", { productId: product._id, quantity: 1 });
      toast.success("Added to Cart successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address || !city || !pincode || !phone || !notes) {
      return toast.error("All shipping fields are required");
    }
    if (phone.length !== 10) {
      return toast.error("Phone number must be 10 digits");
    }

    try {
      setOrderLoading(true);
      await axios.post(`/placeOrder/${product._id}`, {
        address,
        city,
        pincode,
        phone,
        notes,
      });
      toast.success("Order Placed Successfully!");
      setIsModalOpen(false);
      // Reset form
      setAddress("");
      setCity("");
      setPincode("");
      setPhone("");
      setNotes("");
      // Navigate to orders history
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto py-10 px-4 text-center">
        <p className="text-gray-500 text-lg">Product not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg cursor-pointer"
        >
          <FaArrowLeft /> Back to products
        </button>
      </div>
    );
  }

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => navigate("/products")}
        className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 font-semibold mb-6 transition cursor-pointer"
      >
        <FaArrowLeft /> Back to Catalogue
      </button>

      <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Image */}
          <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center">
            <img
              src={product.productImage}
              alt={product.name}
              className="max-h-[500px] w-full object-contain p-4"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider capitalize">
                    {product.category?.replace("-", " ")}
                  </span>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider ml-2 capitalize">
                    Brand: {product.brand?.replace("sea", "")}
                  </span>
                </div>
                <button
                  onClick={toggleWishlist}
                  className="text-gray-400 hover:text-red-500 transition cursor-pointer p-2 rounded-full hover:bg-red-50"
                  title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {inWishlist ? <FaHeart size={24} className="text-red-500" /> : <FaRegHeart size={24} />}
                </button>
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900 mt-4 leading-tight">{product.name}</h1>

              {/* Price section */}
              <div className="flex items-center gap-4 mt-6 border-y border-gray-100 py-4">
                <span className="text-3xl font-black text-blue-600">₹{product.categoryPrice}</span>
                {product.brandPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">M.R.P: ₹{product.brandPrice}</span>
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                      SAVE {Math.round(((Number(product.brandPrice) - Number(product.categoryPrice)) / Number(product.brandPrice)) * 100)}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock status indicator */}
              <div className="mt-6 flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-green-500"}`}></div>
                <span className={`text-sm font-semibold ${isOutOfStock ? "text-red-600" : "text-green-600"}`}>
                  {isOutOfStock ? "Out of Stock" : `In Stock (${product.quantity} items remaining)`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={() => {
                  if (user?.role === "admin") {
                    return toast.error("Admins cannot order products");
                  }
                  setIsModalOpen(true);
                }}
                disabled={isOutOfStock}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 font-semibold py-3 px-6 rounded-xl text-white transition flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-md"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Now / Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Enter Shipping Details</h2>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="ship-address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <textarea
                  id="ship-address"
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
                  <label htmlFor="ship-city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    id="ship-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label htmlFor="ship-pin" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    id="ship-pin"
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
                <label htmlFor="ship-phone" className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  id="ship-phone"
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
                <label htmlFor="ship-notes" className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes / Instructions</label>
                <textarea
                  id="ship-notes"
                  required
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Any delivery instructions (e.g. deliver after 5pm)"
                />
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Product:</span>
                  <span className="font-semibold text-gray-800">{product.name}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-500">Order Amount:</span>
                  <span className="font-bold text-blue-600">₹{product.categoryPrice}</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                  disabled={orderLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition cursor-pointer"
                  disabled={orderLoading}
                >
                  {orderLoading ? "Processing..." : "Confirm & Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
