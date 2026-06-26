import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loggedInUser } from "../store/user";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("kidz-app");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/login", {
        email,
        password,
      });
      toast.success(res?.data?.message);
      localStorage.setItem("kidz-app", res?.data?.token);
      dispatch(loggedInUser(res?.data?.user));
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden flex max-w-4xl w-full">
        <div className="w-1/2 hidden md:block">
          <img
            src="https://kidzfirststep.vercel.app/assets/girl-BL9pA9ly.jpeg"
            alt="register"
            className="w-full h-full object-cover"
          />
        </div>

        <form className="w-full md:w-1/2 p-8" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
            >
              Login
            </button>
          </div>

          <p className="text-center mt-4 text-gray-600">
            Create new account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
