import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loggedInUser } from "../store/user.js";

const AppLayout = () => {
  const token = localStorage.getItem("kidz-app");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function fetchProfile() {
    try {
      const res = await axios.get("/fetchProfile");
      dispatch(loggedInUser(res?.data?.message));
    } catch (error) {
      if (!token) {
        navigate("/login");
        return;
      }
      // 401 error is handled by axios interceptor
      if (error?.response?.status !== 401) {
        toast.error(error?.response?.data?.message);
      }
    }
  }

  useEffect(() => {
    if (!token) {
      return navigate("/login");
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AppLayout;
