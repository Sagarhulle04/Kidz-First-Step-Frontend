import React, { useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { FaHeart, FaChevronDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../store/user.js";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function handleLogout() {
    try {
      toast.success("Logged Out Successfully");
      localStorage.removeItem("kidz-app");
      dispatch(logoutUser());
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.log(error);
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex-shrink-0">
              <img
                src="https://kidzfirststep.vercel.app/assets/logo_KFS-kHJLIZ4V.png"
                alt="KidzFirstStep Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <div className="hidden md:flex items-center space-x-6 text-gray-700 font-medium">
              <Link
                to="/products"
                className="hover:text-blue-600 transition-colors py-2 text-base"
              >
                Products
              </Link>
              <Link
                to="/wishlist"
                className="hover:text-blue-600 transition-colors py-2 flex items-center gap-1.5 text-base"
              >
                <FaHeart className="text-red-500" size={14} /> Wishlist
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {user ? (
              <div className="flex items-center space-x-6">
                {/* Cart Icon */}
                <button
                  onClick={() => navigate("/cart")}
                  className="text-gray-600 hover:text-blue-600 transition-colors relative p-1.5 cursor-pointer"
                  title="Cart"
                >
                  <CiShoppingCart size={32} strokeWidth={1} />
                </button>

                {/* Wishlist Mobile Icon */}
                <button
                  onClick={() => navigate("/wishlist")}
                  className="md:hidden text-gray-600 hover:text-red-500 transition-colors p-1.5 cursor-pointer"
                  title="Wishlist"
                >
                  <FaHeart size={20} className="text-red-500" />
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 focus:outline-none cursor-pointer group"
                  >
                    <img
                      src={user?.profileImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                      alt={user?.name}
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 group-hover:border-blue-600 transition"
                    />
                    <div className="hidden sm:block text-left">
                      <p className="text-xs text-gray-400">Welcome,</p>
                      <p className="text-sm font-semibold text-gray-700 leading-tight group-hover:text-blue-600 transition">
                        {user?.name?.split(" ")[0]}
                      </p>
                    </div>
                    <FaChevronDown size={10} className="text-gray-400 group-hover:text-blue-600 transition" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-800 truncate">{user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        <p className="text-xs font-semibold text-blue-600 capitalize mt-0.5">Role: {user?.role}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        My Profile
                      </Link>
                      {user?.role === "admin" ? (
                        <Link
                          to="/admin/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          Customer Orders
                        </Link>
                      ) : (
                        <Link
                          to="/orders"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          My Orders
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-100 cursor-pointer font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-medium text-sm py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 transition font-medium text-sm py-2 px-4 rounded-lg shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
