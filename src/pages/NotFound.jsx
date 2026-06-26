import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <h1 className="text-8xl font-extrabold text-gray-900">404</h1>

      <h2 className="mt-4 text-3xl font-semibold text-gray-700">
        Page Not Found
      </h2>

      <p className="mt-3 text-gray-500 text-center max-w-md">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
