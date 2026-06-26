import React from "react";
import { useNavigate } from "react-router-dom";

const images = [
  {
    id: 1,
    imageUrl: "https://kidzfirststep.vercel.app/assets/banner-j2mCsUyv.png",
  },
  {
    id: 2,
    imageUrl: "https://kidzfirststep.vercel.app/assets/banner2-baIjj9Kg.png",
  },
];

const Banner = () => {
  const token = localStorage.getItem("kidz-app");
  const navigate = useNavigate();

  if (!token) {
    navigate("/login");
    return;
  }

  return (
    <div>
      <img
        className="h-130 w-full object-full border-b"
        src="https://kidzfirststep.vercel.app/assets/banner-j2mCsUyv.png"
        alt="banner"
      />
    </div>
  );
};

export default Banner;
